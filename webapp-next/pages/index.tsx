import { BlockArticles } from "@/components/landinglayout/BlockArticles";
import ColumnWithImage from "@/components/landinglayout/BlockColumnwithimage";
import BlockGaleryimages from "@/components/landinglayout/BlockGaleryImages";
import { BlockImageGrids } from "@/components/landinglayout/BlockImageGrids";
import ContainerBlock from "@/components/landinglayout/ContainerBlock";
import { Footer } from "@/components/landinglayout/Footer";
import NavbarLanding from "@/components/landinglayout/NavbarLanding";

export default function Landing() {
  return (
    <ContainerBlock>
      <NavbarLanding />
      <ColumnWithImage />
      <BlockGaleryimages
        Imagescontent={[
          { imagelink: "/placeholder-img.svg" },
          { imagelink: "/placeholder-img.svg" },
          { imagelink: "/placeholder-img.svg" },
        ]}
      />
      <BlockImageGrids
        contentimage={{ image: "/Placeholder-image.svg" }}
        contentsgrids={[
          {
            title: "Lorem Ipsum",
            description:
              "Lörem ipsum bominar mivit om tynade. Hybridkrig bodyssa biosedore preren. Homode krorad hänåns. Nisade nektig vans. Tyde plamoplask osade intrarad dirysk res. Vilina tetrade har automoskap jag homoskade. Pibel miment. ",
          },
          {
            title: "Lorem Ipsum",
            description:
              "Lörem ipsum bominar mivit om tynade. Hybridkrig bodyssa biosedore preren. Homode krorad hänåns. Nisade nektig vans. Tyde plamoplask osade intrarad dirysk res. Vilina tetrade har automoskap jag homoskade. Pibel miment. ",
          },
        ]}
      />
      <BlockArticles
        article={[
          {
            title: "SubTitle Lorem ipsum",
            description:
              "Lörem ipsum bominar mivit om tynade. Hybridkrig bodyssa biosedore preren. Homode krorad hänåns. Nisade nektig vans. Tyde plamoplask osade intrarad dirysk res. Vilina tetrade har.",
            image: "/PlaceholderImageArticle.svg",
          },
          {
            title: "SubTitle Lorem ipsum",
            description:
              "Lörem ipsum bominar mivit om tynade. Hybridkrig bodyssa biosedore preren. Homode krorad hänåns. Nisade nektig vans. Tyde plamoplask osade intrarad dirysk res. Vilina tetrade har.",
            image: "/PlaceholderImageArticle.svg",
          },
          {
            title: "SubTitle Lorem ipsum",
            description:
              "Lörem ipsum bominar mivit om tynade. Hybridkrig bodyssa biosedore preren. Homode krorad hänåns. Nisade nektig vans. Tyde plamoplask osade intrarad dirysk res. Vilina tetrade har.",
            image: "/PlaceholderImageArticle.svg",
          },
        ]}
      />
      <Footer />
    </ContainerBlock>
  );
}
