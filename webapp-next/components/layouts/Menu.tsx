
import { FilterContext } from "@/utils/filters-provider";
import { Box, Flex, Image, Spacer, Stack } from "@chakra-ui/react";
import { useContext } from "react";
import { FiltersAges } from "../filters/Ages";
import { FilterCauses } from "../filters/Causes";
import { FiltersDeathLocations } from "../filters/DeathLocations";
import { FiltersSexes } from "../filters/Sexes";
import { MenuTitle } from "./MenuTitle";
import { SubMenu } from "./SubMenu";
import { MenuLinks } from "./MenuLinks";
import { UserCard } from "./UserCard";
import { FilterDates } from '../filters/Dates';

const ageRanges = [
  { id: 0, label: "0-10 ans", minAge: 0, maxAge: 10 },
  { id: 1, label: "11-20 ans", minAge: 11, maxAge: 20 },
  { id: 2, label: "21-30 ans", minAge: 21, maxAge: 30 },
  { id: 3, label: "31-40 ans", minAge: 31, maxAge: 40 },
  { id: 4, label: "41-50 ans", minAge: 41, maxAge: 50 },
  { id: 5, label: "51-60 ans", minAge: 51, maxAge: 60 },
  { id: 6, label: "61-70 ans", minAge: 61, maxAge: 70 },
  { id: 7, label: "71 ans et +", minAge: 71 },
];

export function Menu() {
  const context = useContext(FilterContext);

  if (!context) {
    throw new Error("Menu must be used within a FilterProvider");
  }

  const { filters, setFilters } = context;

  return (
    <Flex
      flexDir={"column"}
      py={8}
      borderRadius={16}
      bg="white"
      w={80}
      minH={'calc(100vh - 2.5rem)'}
      position="sticky"
      top={0}
      boxShadow="box-shadow: 0px 10px 15px -3px rgba(36, 108, 249, 0.04), 0px 4px 6px -2px rgba(36, 108, 249, 0.04);"
      
    >
      <Box pl={4} px={8}>
        <Image src="/CM2D.svg" alt="CM2D Logo" w={24} />
      </Box>
      <Box mt={5} h="3px" w="full" bg="gray.50" />
      <Box mt={10} px={8}>
        <MenuTitle title="Cause de décès" />
        <FilterCauses filters={filters} setFilters={setFilters} />
      </Box>
      <Box mt={10} px={8}>
        <MenuTitle title="Période" />
        <FilterDates />
      </Box>
      <Box mt={10} px={8}>
        <MenuTitle title="Filtres" />
        <SubMenu
          title="Démographie"

          icon={{
            src: 'icons/user-search-blue.svg',
            srcOpen: 'icons/user-search.svg',
            alt: 'Onglet démographie'
          }}

        >
          <Stack dir="column" spacing={4}>
            <FiltersSexes filters={filters} setFilters={setFilters} />
            <FiltersAges
              filters={filters}
              setFilters={setFilters}
              ages={ageRanges}
            />
          </Stack>
        </SubMenu>
        <SubMenu
          title="Données du décès"
          icon={{

            src: 'icons/file-list-search-blue.svg',
            srcOpen: 'icons/file-list-search.svg',
            alt: 'Onglet données du décès'

          }}
        >
          <Stack dir="column" spacing={4}>
            <FiltersDeathLocations filters={filters} setFilters={setFilters} />
          </Stack>
        </SubMenu>
          <Spacer h={"8rem"}/>
        
        <MenuLinks
          links={[
            {
              label: "À propos",
              icon: "/icons/about-circle.svg",
              link: "/",
            },
          ]}
        />
        <MenuLinks
          links={[
            {
              label: "Réglages",
              icon: "/icons/settings.svg",
              link: "/",
            },
          ]}
        />
        <MenuLinks
          links={[
            {
              label: "Déconnexion",
              icon: "/icons/log-out.svg",
              link: "/",
            },
          ]}
        />
        
        <Box position="absolute" left={0} width={325}>
          <UserCard
            user={{
              firstName: "John",
              lastName: "Doe",
              email: "jeneconnaispasmonemail@jsp.com",
              avatar: "/icons/avatar.svg",
            }}
          />
        </Box>
      </Box>
    </Flex>
  );
}
