import { FormResetPassword } from "@/components/login/FormResetPassword";
import { ColumnWithImage } from "@/components/login/ColumnWithImage";
import { Flex } from "@chakra-ui/react";

export default function ForgotPassword() {
  return (
    <Flex maxH="100vh" px={4} w="full">
      <Flex display={["none", "flex"]} w="50%" py={6}>
        <ColumnWithImage />
      </Flex>
      <Flex w={["full", "50%"]}>
        <FormResetPassword />
      </Flex>
    </Flex>
  );
}
