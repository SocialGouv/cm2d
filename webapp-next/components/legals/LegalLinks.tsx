import { Link, Wrap, WrapItem } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

const links = [
  { label: 'Mentions légales', path: '/legals/mentions-legales' },
  { label: "Conditions générales d'utilisation", path: '/legals/cgu' },
  { label: 'Politique de confidentialité', path: '/legals/pc' }
];

export const LegalLinks = () => {
  const router = useRouter();
  return (
    <Wrap spacing={10} justify="center" mb={12}>
      {links.map((link, index) => (
        <WrapItem
          key={index}
          bg={router.pathname === link.path ? 'primary.500' : 'primary.75'}
          py={2}
          px={4}
          color={router.pathname === link.path ? 'white' : 'inherit'}
          rounded="lg"
        >
          <Link as={NextLink} href={link.path}>
            {link.label}
          </Link>
        </WrapItem>
      ))}
    </Wrap>
  );
};
