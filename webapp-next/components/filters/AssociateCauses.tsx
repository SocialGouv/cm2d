import { useAssociateCauses } from '@/utils/api';
import { Cm2dContext } from '@/utils/cm2d-provider';
import { capitalizeString, removeAccents } from '@/utils/tools';
import { CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tag,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { MenuSubTitle } from '../layouts/MenuSubTitle';
import { useDebounce } from '@uidotdev/usehooks';

type AssociateCauses = {
  value: string;
  label: string;
}[];

type Props = {};

export const FilterAssociateCauses = (props: Props) => {
  const context = useContext(Cm2dContext);
  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearchTerm = useDebounce(search, 300);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setIsSearching(search !== debouncedSearchTerm);
  }, [search, debouncedSearchTerm]);

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const { filters, setFilters, setView, setSaveAggregateX } = context;
  const { data } = useAssociateCauses();

  if (!data) return <>...</>;

  const associateCauses: AssociateCauses = data.result.hits.hits.map(
    (d: any) => ({
      value: d._source.categories_associate,
      label: d._id
    })
  );

  const sanitizedSearch = removeAccents(debouncedSearchTerm);
  const regex = new RegExp(sanitizedSearch, 'i');

  return (
    <Box>
      {!!filters.categories_associate.length && (
        <MenuSubTitle
          title={`Causes associées à "${capitalizeString(
            filters.categories[0]
          )}"`}
        />
      )}
      {filters.categories_associate.map(ca => (
        <Box key={ca} mx={-1}>
          <Tag mb={2} lineHeight={1.5} py={1}>
            <Text>{ca}</Text>
            <CloseIcon
              ml={2}
              fontSize="10px"
              cursor="pointer"
              onClick={() => {
                setFilters({
                  ...filters,
                  categories_associate: filters.categories_associate.filter(
                    fca => fca !== ca
                  )
                });
              }}
            />
          </Tag>
        </Box>
      ))}
      <Link
        color="primary.500"
        textDecor={'underline'}
        mt={3}
        display="block"
        onClick={onOpen}
      >
        Gérer mes causes associées
      </Link>
      {filters.categories_associate.length > 1 && (
        <Link
          color="primary.500"
          textDecor={'underline'}
          mt={3}
          display="block"
          onClick={() => {
            setSaveAggregateX('categories_associate');
            setView('histogram');
          }}
        >
          Voir la distribution
        </Link>
      )}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={'6xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Gestion des causes associées</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb={6}>
              <Text mb={2}>Rechercher dans la liste :</Text>
              <InputGroup>
                <Input
                  py={6}
                  type="text"
                  placeholder="Recherchez..."
                  onChange={e => setSearch(e.target.value)}
                  value={search}
                />
                {!!search && (
                  <InputRightElement>
                    <CloseIcon
                      cursor={'pointer'}
                      onClick={() => {
                        setSearch('');
                      }}
                    />
                  </InputRightElement>
                )}
              </InputGroup>
              <Box display="flex" justifyContent={'end'} mt={6}>
                <Link
                  color="primary.500"
                  textDecor={'underline'}
                  onClick={() => {
                    setFilters({ ...filters, categories_associate: [] });
                  }}
                >
                  Tout dé-sélectionner
                </Link>
              </Box>
            </Box>
            <Box maxH="50vh" minH="50vh" overflowY="scroll">
              {isSearching ? (
                <Spinner color="#246CF9" size="md" />
              ) : (
                associateCauses
                  .filter(ac => regex.test(removeAccents(ac.value)))
                  .map(ac => (
                    <Box key={ac.label} mb={3}>
                      <Checkbox
                        colorScheme="primary"
                        onChange={e => {
                          if (e.target.checked) {
                            filters.categories_associate.push(ac.value);
                            setFilters({ ...filters });
                          } else {
                            setFilters({
                              ...filters,
                              categories_associate:
                                filters.categories_associate.filter(
                                  fac => fac !== ac.value
                                )
                            });
                          }
                        }}
                        isChecked={filters.categories_associate.includes(
                          ac.value
                        )}
                      >
                        {ac.value}
                      </Checkbox>
                    </Box>
                  ))
              )}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="primary" mr={3} onClick={onClose}>
              Fermer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
