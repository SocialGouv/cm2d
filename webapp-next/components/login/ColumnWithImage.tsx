import { Box, Flex, Image } from '@chakra-ui/react';
import Slider from './Slider';

export const ColumnWithImage = () => {
  return (
    <Flex
      bg={'primary.50'}
      flexDirection="column"
      h="full"
      w="full"
      pt={8}
      pb={16}
      px={20}
      borderLeftRadius="2xl"
      justifyContent="space-between"
    >
      <Image src="/CM2D.svg" h={7} alignSelf={'flex-start'} />

      <Image src="/Left.svg" w={'full'} maxH={'60%'} />

      <Slider
        slideContents={[
          {
            title: 'Lorem ipsum dolor !',
            description:
              'Lörem ipsum eunade betreska. Döll näns. Anterolons terar vapunde pultvätta. Povor rebelt, innan attitydig !'
          }
          // {
          //   title: 'Lorem ipsum dolor !',
          //   description:
          //     'Lörem ipsum eunade betreska. Döll näns. Anterolons terar vapunde pultvätta. Povor rebelt, innan attitydig !'
          // },
          // {
          //   title: 'Lorem ipsum dolor !',
          //   description:
          //     'Lörem ipsum eunade betreska. Döll näns. Anterolons terar vapunde pultvätta. Povor rebelt, innan attitydig !'
          // },
          // {
          //   title: 'Lorem ipsum dolor !',
          //   description:
          //     'Lörem ipsum eunade betreska. Döll näns. Anterolons terar vapunde pultvätta. Povor rebelt, innan attitydig !'
          // }
        ]}
      />
    </Flex>
  );
};
