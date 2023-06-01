import ContainerLogin from "@/components/loginComponents/ContainerLogin";
import { Box, Wrap, WrapItem } from "@chakra-ui/react";
import { ColumnWithImage } from "@/components/loginComponents/ColumnWithImage";
import { FormLogin } from "@/components/loginComponents/FormLogin";

export default function LoginPage() {
  return (
    <ContainerLogin>
      <Box p={[0, 6]}>
        <Wrap h={["1200px", "95vh"]} borderLeftRadius={20}>
          <WrapItem   flex={1} >
            <ColumnWithImage />
          </WrapItem>
          <WrapItem   flex={1} >
            <FormLogin/>
          </WrapItem>
        </Wrap>
      </Box>
    </ContainerLogin>
  );
}
