import {
  Container,
  Box,
  Flex,
  Image,
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
    <Container maxW="1252px" mb={5}>
      <Flex flexDir="column" mb={16}>
        <Box mb={[2, 4, 2]}>
          <Text fontSize={['20px', '26px', '36px']} fontWeight="600" mb={4}>
            Des technologies innovantes au service des utilisateurs
          </Text>
          <Text
            fontSize={['14px', '16px', '18px']}
            fontWeight={'400'}
            color={'neutral.500'}
          >
            Le traitement du langage permet de traiter le texte brut et de
            catégoriser les données de mortalité pour vous permettre de les
            exploiter de façon optimale.
          </Text>
        </Box>

        <Box alignItems={'left'}>
          <Image
            src={contentimage.image}
            alt="image"
            width={'full'}
            mb={[2, 5, 10]}
            mt={4}
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
    </Container>
  );
};
