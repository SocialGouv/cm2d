import {
  Grid,
  GridItem,
  Image,
  Box,
  Flex,
  Text,
  Wrap,
  WrapItem
} from '@chakra-ui/react';

type ContentsGrids = {
  title: string;
  description: string;
};

type ContentsImage = {
  image: string;
};

interface Contentsofpage {
  contentimage: ContentsImage;
  contentsgrids: ContentsGrids[];
}

export const BlockImageGrids: React.FC<Contentsofpage> = ({
  contentimage,
  contentsgrids
}) => {
  return (
    <Flex flexDir="column" mb={16} pt={[5, 10, 14]} mx={[5, 20, 52]}>
      <Box mb={[2, 4, 2]}>
        <Text fontSize={['20px', '26px', '36px']} fontWeight="600" mb={4}>
          Une expérimentation propulsée par l’ARS Ile de France
        </Text>
        <Text
          fontSize={['14px', '16px', '18px']}
          fontWeight={'400'}
          color={'neutral.500'}
        >
          Cette première version a été conçue et développée en 2023 par la
          Direction de l’Innovation, de la Recherche et de la Transformation
          numérique de l’ARS Ile de France, en partenariat avec la Direction
          générale de la Santé et la Fabrique numérique des ministères sociaux.
        </Text>
      </Box>

      <Box alignItems={'left'}>
        <Image
          src={contentimage.image}
          alt="image"
          height={['sm', 'md', 'xl']}
          width={'full'}
          my={[2, 5, 6]}
          mb={[2, 5, 10]}
        />
      </Box>
      <Wrap justify="left" w={'full'} spacing={20}>
        {contentsgrids.map((content, index) => (
          <WrapItem flex={2} key={index}>
            <Box>
              <Text fontSize={['14px', '18px', '24px']} mb={4}>
                {content.title}
              </Text>
              <Text
                fontSize={['14px', '16px', '18px']}
                fontWeight={400}
                color={'neutral.500'}
              >
                {content.description}
              </Text>
            </Box>
          </WrapItem>
        ))}
      </Wrap>
    </Flex>
  );
};
