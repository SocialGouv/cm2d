import { Flex, Box, Text, Image, Wrap, WrapItem } from '@chakra-ui/react';

type Images = {
  imagelink: string;
};

interface Imagescontents {
  Imagescontent: Images[];
}

const BlockGaleryimages: React.FC<Imagescontents> = ({ Imagescontent }) => {
  return (
    <Flex my={[10, 15, 20]} flexDir="column">
      <Box mb={5} mx={[5, 20, 52]}>
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
          CM2D offre un accès sécurisé aux données des certificats de décès
          papiers et électroniques et propose aux utilisateurs de réaliser des
          requêtes et analyses sur des pathologies ciblées. Les étapes clefs :
        </Text>
      </Box>

      <Wrap justify="center" w={'full'} spacing={20}>
        {Imagescontent.map((image, index) => (
          <WrapItem key={index}>
            <Box mt={10}>
              <Image
                src={image.imagelink ? image.imagelink : ''}
                alt="Image 1"
              />
            </Box>
          </WrapItem>
        ))}
      </Wrap>
    </Flex>
  );
};

export default BlockGaleryimages;
