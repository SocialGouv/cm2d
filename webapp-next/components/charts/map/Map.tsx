import { Cm2dContext } from '@/utils/cm2d-provider';
import { getMapProps } from '@/utils/map/props';
import { Flex, Text } from '@chakra-ui/react';
import { geoConicConformal, geoMercator } from 'd3-geo';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { MapLegends } from './MapLegends';
import { MapTooltip } from './MapTooltip';

type Props = {
  id: string;
  datasets: { hits: any[]; total?: number }[];
};

type GeoFeature = {
  type: 'Feature';
  properties: { code: string; nom: string };
  geometry: any;
};

const GEO_URL = '/geo/departements.geojson';
const DROM_CODES = ['971', '972', '973', '974', '976'];
const NEUTRAL_FILL = '#e0e0e0';
const NEUTRAL_STROKE = '#c8c8c8';

const METRO_SIZE = 600;
const DROM_SIZE = 130;

export default function MapIframe(props: Props) {
  const { datasets } = props;
  const context = useContext(Cm2dContext);

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const { filters, saveAggregateX } = context;

  const [geojson, setGeojson] = useState<{ features: GeoFeature[] } | null>(
    null
  );

  // Département survolé + position souris (viewport) pour l'infobulle.
  const [hovered, setHovered] = useState<{
    code: string;
    nom: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    let active = true;
    fetch(GEO_URL)
      .then(res => res.json())
      .then(json => {
        if (active) setGeojson(json);
      })
      .catch(() => {
        if (active) setGeojson({ features: [] });
      });
    return () => {
      active = false;
    };
  }, []);

  // Mémoïsé : évite de reconstruire toute la carte des départements à chaque
  // mouvement de souris (l'infobulle déclenche des re-renders fréquents).
  const { config } = useMemo(
    () => getMapProps(datasets, filters.region_departments, saveAggregateX),
    [datasets, filters.region_departments, saveAggregateX]
  );
  const statesByCode = config?.state_specific ?? {};

  // Départements dans le périmètre courant (région sélectionnée / France entière).
  const scoped = useMemo(
    () => new Set(filters.region_departments),
    [filters.region_departments]
  );

  const fillFor = (code: string) =>
    statesByCode[code] ? statesByCode[code].color : NEUTRAL_FILL;
  const hoverFor = (code: string) =>
    statesByCode[code] ? statesByCode[code].hover_color : NEUTRAL_STROKE;

  const onGeoMove =
    (code: string, nom: string) => (e: React.MouseEvent) =>
      setHovered({ code, nom, x: e.clientX, y: e.clientY });
  const onGeoLeave = () => setHovered(null);

  const features: GeoFeature[] = geojson?.features ?? [];

  const metroFeatures = useMemo(
    () => features.filter(f => !DROM_CODES.includes(f.properties.code)),
    [features]
  );

  // Encarts DROM : seulement ceux présents dans le périmètre (France entière
  // ou région d'outre-mer). La carte principale reste métropolitaine.
  const dromFeatures = useMemo(
    () =>
      features.filter(
        f => DROM_CODES.includes(f.properties.code) && scoped.has(f.properties.code)
      ),
    [features, scoped]
  );

  const metroProjection = useMemo(() => {
    if (!metroFeatures.length) return null;
    return geoConicConformal()
      .rotate([-3, 0])
      .fitSize([METRO_SIZE, METRO_SIZE], {
        type: 'FeatureCollection',
        features: metroFeatures
      } as any);
  }, [metroFeatures]);

  if (!geojson) {
    return <Text>Chargement de la carte…</Text>;
  }

  if (!metroProjection) {
    return <Text>Carte indisponible.</Text>;
  }

  return (
    <Flex flexDir="column">
      <Flex justifyContent="end">
        <MapLegends />
      </Flex>
      <Flex alignItems="flex-start">
        <ComposableMap
          projection={metroProjection as any}
          width={METRO_SIZE}
          height={METRO_SIZE}
          style={{ width: '65%', height: 'auto' }}
        >
          <Geographies
            geography={{ type: 'FeatureCollection', features: metroFeatures }}
          >
            {({ geographies }: { geographies: any[] }) =>
              geographies.map(geo => {
                const code = geo.properties.code;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillFor(code)}
                    stroke="#ffffff"
                    strokeWidth={0.5}
                    onMouseMove={onGeoMove(code, geo.properties.nom)}
                    onMouseLeave={onGeoLeave}
                    style={{
                      default: { outline: 'none' },
                      hover: { fill: hoverFor(code), outline: 'none' },
                      pressed: { outline: 'none' }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        <Flex
          w="35%"
          maxH="600px"
          overflowY="auto"
          ml={4}
          direction="column"
        >
          {dromFeatures.length > 0 && (
            <Flex wrap="wrap" mb={4} gap={3}>
              {dromFeatures.map(feature => {
                const code = feature.properties.code;
                const projection = geoMercator().fitSize(
                  [DROM_SIZE, DROM_SIZE],
                  feature as any
                );
                return (
                  <Flex key={code} direction="column" align="center">
                    <ComposableMap
                      projection={projection as any}
                      width={DROM_SIZE}
                      height={DROM_SIZE}
                      style={{ width: DROM_SIZE, height: DROM_SIZE }}
                    >
                      <Geographies
                        geography={{
                          type: 'FeatureCollection',
                          features: [feature]
                        }}
                      >
                        {({ geographies }: { geographies: any[] }) =>
                          geographies.map(geo => (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill={fillFor(code)}
                              stroke="#ffffff"
                              strokeWidth={0.5}
                              onMouseMove={onGeoMove(
                                code,
                                geo.properties.nom
                              )}
                              onMouseLeave={onGeoLeave}
                              style={{
                                default: { outline: 'none' },
                                hover: {
                                  fill: hoverFor(code),
                                  outline: 'none'
                                },
                                pressed: { outline: 'none' }
                              }}
                            />
                          ))
                        }
                      </Geographies>
                    </ComposableMap>
                    <Text fontSize="xs" textAlign="center">
                      {feature.properties.nom}
                    </Text>
                  </Flex>
                );
              })}
            </Flex>
          )}
        </Flex>
      </Flex>

      {hovered && (
        <MapTooltip
          fallbackName={hovered.nom}
          state={statesByCode[hovered.code]}
          x={hovered.x}
          y={hovered.y}
        />
      )}
    </Flex>
  );
}
