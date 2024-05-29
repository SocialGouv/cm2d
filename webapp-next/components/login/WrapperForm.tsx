import { Box, Heading } from "@chakra-ui/react";
import React from "react";

export const WrapperForm = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      mx={"auto"}
      mt={[8, 0]}
    >
      <Box w="lg" mx={[10, 20]} p={[0, 2]} bgColor="white">
        <Heading
          as="h1"
          size="lg"
          mb={6}
          fontSize={["2xl", "5xl"]}
          fontWeight={700}
        >
          {title}
        </Heading>
        <>{children}</>
      </Box>
    </Box>
  );
};
