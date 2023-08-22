import {
  Flex,
  Box,
  Text,
  Image,
  Grid,
  GridItem,
  Container
} from '@chakra-ui/react';

type Images = {
  title: string;
  imagelink: string;
};

interface Imagescontents {
  Imagescontent: Images[];
}

const BlockGaleryimages: React.FC<Imagescontents> = ({ Imagescontent }) => {
  return (
    <Flex my={[10, 15, 20]} flexDir="column">
      <Container maxW="1252px" mb={5}>
        <Text
          fontSize={['20px', '26px', '36px']}
          fontWeight="600"
          mb={4}
          lineHeight={1.3}
        >
          Un service inédit à destination des agents des ARS
        </Text>
        <Text
          color={'neutral.500'}
          fontWeight={'400'}
          fontSize={['14px', '16px', '18px']}
        >
          Un service inédit à destination des agents des ARS. CM2D offre un
          accès sécurisé aux données des certificats de décès papiers et
          électroniques et propose aux utilisateurs de réaliser des requêtes et
          analyses sur des pathologies ciblées. Les étapes clefs :
        </Text>

        <Grid
          templateColumns={[
            'repeat(1, 1fr)',
            'repeat(1, 1fr)',
            'repeat(2, 1fr)',
            'repeat(2, 1fr)',
            'repeat(4, 1fr)'
          ]}
          gap={6}
          mt={10}
        >
          {Imagescontent.map((image, index) => (
            <GridItem key={index}>
              <Box>
                <Text as="b" color="primary.500">
                  {image.title}
                </Text>
                <Image
                  mt={4}
                  src={image.imagelink ? image.imagelink : ''}
                  alt="Image 1"
                />
              </Box>
            </GridItem>
          ))}
        </Grid>
      </Container>
    </Flex>
  );
};

export default BlockGaleryimages;
