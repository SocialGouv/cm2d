import { Box, Flex, Image } from "@chakra-ui/react";
import Slider from "./Slider";

export const ColumnWithImage = () => {
  return (
    <Flex
      bg={"primary.50"}
      flexDirection="column"
      h="full"
      w="full"
      pt={8}
      pb={16}
      px={20}
      borderLeftRadius="2xl"
      justifyContent="space-between"
    >
      <Flex alignItems="center">
        <Image src="/CM2D.svg" alt="CM2D Logo" w={24} mr={1.5} />
        x
        <Image src="/ARS_logo.svg.png" alt="ARS Logo" w={16} ml={2} mt={3} />
      </Flex>

      <Image src="/Left.svg" w={"full"} maxH={"60%"} />

      <Slider
        slideContents={[
          {
            title: "Explorez les données sur les causes de décès",
            description:
              "L’application CM2D permet de générer des visualisations de données sur mesure afin d’orienter et d’évaluer vos actions sur le terrain.",
          },
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
