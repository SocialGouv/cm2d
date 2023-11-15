import { Cm2dContext } from '@/utils/cm2d-provider';
import { getMapProps } from '@/utils/map/props';
import { MapConfig } from '@/utils/map/type';
import { Flex } from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { MapDetails } from './MapDetails';
import { MapLegends } from './MapLegends';

type Props = {
  id: string;
  datasets: { hits: any[]; total?: number }[];
};

export default function MapIframe(props: Props) {
  const iframeRef = React.useRef(null);
  const { datasets, id } = props;
  const [mapConfig, setMapConfig] = useState<MapConfig | null>(null);
  const context = useContext(Cm2dContext);

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const { saveAggregateX } = context;

  const writeHTMLToIframe = () => {
    const iframe = iframeRef.current;

    if (iframe) {
      const doc = (iframe as any).contentWindow.document;
      const mapProps = getMapProps(id, datasets, saveAggregateX);
      doc.open();
      doc.write(`
      <html>
        <head>
					<script type="text/javascript">
						document.addEventListener('click', function(event) {
							event.stopPropagation();
						}, true);
					</script>
					<script type="text/javascript">
						${mapProps.injectJs}
					</script>
					<script type="text/javascript" src="libs/countrymap/countrymap.js"></script>
					<style>
						#${id}_access {
							display: none !important;
						}setMapConfig
					</style>
        </head>
        <body style="display: flex; justify-content: center;">
          <div id="${id}"></div>
        </body>
      </html>
    `);
      doc.close();

      if (mapProps.config) setMapConfig(mapProps.config);
    }
  };

  React.useEffect(() => {
    const iframe = iframeRef.current;
    if ((iframe as any).contentWindow.document.readyState === 'complete') {
      writeHTMLToIframe();
    } else {
      (iframe as any).onload = writeHTMLToIframe;
    }
  }, []);

  return (
    <Flex flexDir="column">
      <Flex justifyContent="end">
        <MapLegends />
      </Flex>
      <Flex alignItems="center">
        <iframe
          title="Map"
          ref={iframeRef}
          width={'65%'}
          height="700px"
          loading="lazy"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
        />
        {mapConfig && (
          <Flex w="30%" maxH="400px" overflowY="auto">
            <MapDetails mapConfig={mapConfig} />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
