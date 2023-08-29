import ColumnWithImage from '@/components/landing/BlockColumnwithimage';
import BlockGaleryimages from '@/components/landing/BlockGaleryImages';
import { BlockImageGrids } from '@/components/landing/BlockImageGrids';
import { Footer } from '@/components/landing/Footer';

export default function Landing() {
  return (
    <>
      <ColumnWithImage />
      <BlockGaleryimages
        Imagescontent={[
          { title: '1 | Choisir une cause de décès', imagelink: '/step-1.svg' },
          { title: '2 | Paramétrer votre requête', imagelink: '/step-2.svg' },
          { title: '3 | Visualiser vos données', imagelink: '/step-3.svg' },
          { title: '4 | Extraire vos résultats', imagelink: '/step-4.svg' }
        ]}
      />
      <BlockImageGrids
        contentimage={{ image: '/tech.svg' }}
        contentsgrids={[
          {
            title: 'Un service construit avec les utilisateurs',
            description:
              'L’élaboration de cette application a associé des professionnels de santé et agents de l’ARS Ile de France et a pour ambition de rendre les données de mortalité plus accessibles et compréhensibles pour des agents du terrain.'
          },
          {
            title: 'Une première version amenée à évoluer',
            description:
              'L’application se concentre aujourd’hui sur 3 pathologies principales : AVC, tuberculose et suicide. Elle sera à amenée à évoluer pour couvrir plus de pathologies, présenter de nouvelles fonctionnalités et être accessible à l’ensemble des ARS.'
          }
        ]}
      />
      {/* <BlockArticles
        article={[
          {
            title: 'SubTitle Lorem ipsum',
            description:
              'Lörem ipsum bominar mivit om tynade. Hybridkrig bodyssa biosedore preren. Homode krorad hänåns. Nisade nektig vans. Tyde plamoplask osade intrarad dirysk res. Vilina tetrade har.',
            image: '/PlaceholderImageArticle.svg'
          },
          {
            title: 'SubTitle Lorem ipsum',
            description:
              'Lörem ipsum bominar mivit om tynade. Hybridkrig bodyssa biosedore preren. Homode krorad hänåns. Nisade nektig vans. Tyde plamoplask osade intrarad dirysk res. Vilina tetrade har.',
            image: '/PlaceholderImageArticle.svg'
          },
          {
            title: 'SubTitle Lorem ipsum',
            description:
              'Lörem ipsum bominar mivit om tynade. Hybridkrig bodyssa biosedore preren. Homode krorad hänåns. Nisade nektig vans. Tyde plamoplask osade intrarad dirysk res. Vilina tetrade har.',
            image: '/PlaceholderImageArticle.svg'
          }
        ]}
      /> */}
    </>
  );
}
