import { BlockArticles } from '@/components/landinglayout/BlockArticles';
import ColumnWithImage from '@/components/landinglayout/BlockColumnwithimage';
import BlockGaleryimages from '@/components/landinglayout/BlockGaleryImages';
import BlockImageGrids from '@/components/landinglayout/BlockImageGrids';
import ContainerBlock from '@/components/landinglayout/ContainerBlock';
import { Footer } from '@/components/landinglayout/Footer';
import NavbarLanding from '@/components/landinglayout/NavbarLanding';

export default function Landing() {
  return (
    <ContainerBlock>
      <NavbarLanding />
      <ColumnWithImage />
      <BlockGaleryimages />
      <BlockImageGrids />
      <BlockArticles />
      <Footer />
    </ContainerBlock>
  );
}
