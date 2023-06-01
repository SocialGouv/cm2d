import { Box, Flex, Image } from "@chakra-ui/react";
import Slider from "./Slider";

export const ColumnWithImage = () => {
  return (
    <Flex bg={"primary.50"} >
      <Box px={[4, 20]} py={[10, 7]}>
        <Image src="/CM2D.svg" h={7} />

        <Image src="/Left.svg" px={[0, 36]} py={[10, 20]} h={"75%"} w={"full"}/>

        <Slider
          slideContents={[
            {
              title: "Lorem ipsum dolor !",
              description:
                "Lörem ipsum eunade betreska. Döll näns. Anterolons terar vapunde pultvätta. Povor rebelt, innan attitydig !",
            },
            {
              title: "Lorem ipsum dolor !",
              description:
                "Lörem ipsum eunade betreska. Döll näns. Anterolons terar vapunde pultvätta. Povor rebelt, innan attitydig !",
            },
            {
              title: "Lorem ipsum dolor !",
              description:
                "Lörem ipsum eunade betreska. Döll näns. Anterolons terar vapunde pultvätta. Povor rebelt, innan attitydig !",
            },
            {
              title: "Lorem ipsum dolor !",
              description:
                "Lörem ipsum eunade betreska. Döll näns. Anterolons terar vapunde pultvätta. Povor rebelt, innan attitydig !",
            },
          ]}
        />
      </Box>
    </Flex>
  );
};
