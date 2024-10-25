import { Box, Flex, Image, Modal, ModalOverlay, Spacer, Stack, useDisclosure } from '@chakra-ui/react';
import { Cm2dContext, baseFilters } from '@/utils/cm2d-provider';
import { useContext } from 'react';
import { FiltersAges } from '../filters/Ages';
import { FilterCauses } from '../filters/Causes';
import { FiltersDeathLocations } from '../filters/DeathLocations';
import { FiltersSexes } from '../filters/Sexes';
import { MenuTitle } from './MenuTitle';
import { SubMenu } from './SubMenu';
import { MenuLinks } from './MenuLinks';
import { UserCard } from './UserCard';
import { FilterDates } from '../filters/Dates';
import { FiltersDepartments } from '../filters/Departments';
import cookie from 'js-cookie';
import { hasAtLeastOneFilter, ELASTIC_API_KEY_NAME, swrPOSTFetch } from '@/utils/tools';
import { FilterAssociateCauses } from '../filters/AssociateCauses';
import { RegionFilter } from '../filters/Regions';
import useSWRMutation from 'swr/mutation';
import SettingsModal from '../modals/settings';

export const ageRanges = [
  { from: 0, to: 0, key: 'Moins de 1 an' },
  { from: 1, to: 5, key: '1-5 ans' },
  { from: 6, to: 10, key: '6-10 ans' },
  { from: 11, to: 20, key: '11-20 ans' },
  { from: 21, to: 30, key: '21-30 ans' },
  { from: 31, to: 40, key: '31-40 ans' },
  { from: 41, to: 50, key: '41-50 ans' },
  { from: 51, to: 60, key: '51-60 ans' },
  { from: 61, to: 70, key: '61-70 ans' },
  { from: 71, key: '71 ans et +' }
];

export function Menu() {
  const context = useContext(Cm2dContext);

  const {
    isOpen: isOpenSettings,
    onClose: onCloseSettings,
    onOpen: onOpenSettings
  } = useDisclosure();

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const { trigger: triggerInvalidateApiKey } = useSWRMutation(
    "/api/auth/invalidate-api-key",
    swrPOSTFetch<{ username: string }>
  );

  const { filters, setFilters, user } = context;

  return (
    <Flex
      flexDir={'column'}
      pt={8}
      borderRadius={16}
      bg="white"
      w={88}
      minH={'calc(100vh - 2.5rem)'}
      position="sticky"
      top={0}
      boxShadow="0px 8px 15px -4px rgba(36, 108, 249, 0.08), 0px 4px 6px -2px rgba(36, 108, 249, 0.08);"
    >
      <Flex alignItems="center" pl={4} px={6}>
        <Image src="/CM2D.svg" alt="CM2D Logo" w={24} mr={1.5} />
        x
        <Image src="/ARS_logo.svg.png" alt="ARS Logo" w={16} ml={2} mt={3} />
      </Flex>
      <Box mt={5} h="3px" w="full" bg="gray.50" />
      <Box mt={5} px={6}>
        <RegionFilter />
      </Box>
      <Box mt={5} h="3px" w="full" bg="gray.50" />
      <Box mt={10} px={6}>
        <MenuTitle title="Mention recherchée" />
        <FilterCauses />
      </Box>
      <Box mt={10} px={6}>
        <MenuTitle title="Période" />
        <FilterDates />
      </Box>
      <Box mt={10} px={6}>
        <MenuTitle
          title="Filtres"
          button={
            hasAtLeastOneFilter(filters)
              ? {
                  label: 'Réinitialiser',
                  onClick: () => {
                    setFilters({
                      ...baseFilters,
                      categories: filters.categories,
                      start_date: filters.start_date,
                      end_date: filters.end_date
                    });
                  }
                }
              : undefined
          }
        />
        <SubMenu
          title={
            <>
              Données
              <br />
              sociodémographiques
            </>
          }
          icon={{
            src: 'icons/user-search-blue.svg',
            srcOpen: 'icons/user-search.svg',
            alt: 'Onglet démographie'
          }}
        >
          <Stack dir="column" spacing={4}>
            <FiltersSexes />
            <FiltersAges ages={ageRanges} />
          </Stack>
        </SubMenu>
        <SubMenu
          title={
            <>
              Autres données
              <br />
              certifiées
            </>
          }
          icon={{
            src: 'icons/file-list-search-blue.svg',
            srcOpen: 'icons/file-list-search.svg',
            alt: 'Onglet données du décès'
          }}
        >
          <Stack dir="column" spacing={4}>
            <FiltersDepartments />
            <FiltersDeathLocations />
          </Stack>
        </SubMenu>
        <SubMenu
          title={<>Causes associées</>}
          icon={{
            src: 'icons/folder-open-blue.svg',
            srcOpen: 'icons/folder-open.svg',
            alt: 'Onglet causes associées'
          }}
          isDisabled={
            !filters.categories.length || filters.categories_search !== 'full'
          }
          disabledMessage={
            !filters.categories.length
              ? 'Veuillez sélectionner une cause de décès pour accéder aux causes associées'
              : 'Pour associer des causes, veuillez désélectionner "Rechercher uniquement dans le processus morbide"'
          }
          forceCollapse={filters.categories_search !== 'full'}
        >
          <Stack dir="column" spacing={4}>
            <FilterAssociateCauses />
          </Stack>
        </SubMenu>
      </Box>
      <Box mt="auto">
        <Box px={6}>
          <MenuLinks
            links={[
              {
                label: 'À propos',
                icon: '/icons/about-circle.svg',
                link: '/about'
              },
              {
                label: 'Paramètres du compte',
                icon: '/icons/settings.svg',
                onClick: onOpenSettings
              },
              {
                label: 'Mentions légales',
                icon: '/icons/shield-user.svg',
                link: '/legals/mentions-legales'
              },
              {
                label: 'Déconnexion',
                icon: '/icons/log-out.svg',
                onClick: () => {
                  triggerInvalidateApiKey({
                    username: context.user.username as string
                  }).then(() => {
                    window.location.reload();
                  });
                },
                link: '/'
              }
            ]}
          />
        </Box>
        <UserCard user={user} />
      </Box>
      <Modal
        isOpen={isOpenSettings}
        onClose={onCloseSettings}
        size="lg"
        isCentered
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <SettingsModal user={user} onClose={onCloseSettings} />
      </Modal>
    </Flex>
  );
}
