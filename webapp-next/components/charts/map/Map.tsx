import { getMapProps } from '@/utils/map/props';
import { Flex } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { Legends } from './Legends';
import { Cm2dContext } from '@/utils/cm2d-provider';

type Props = {
  id: string;
  datasets: { hits: any[]; total?: number }[];
};

export default function MapIframe(props: Props) {
  const iframeRef = React.useRef(null);
  const { datasets, id } = props;
  const context = useContext(Cm2dContext);

  if (!context) {
    throw new Error('Menu must be used within a Cm2dProvider');
  }

  const { saveAggregateX } = context;

  const writeHTMLToIframe = () => {
    const iframe = iframeRef.current;

    if (iframe) {
      const doc = (iframe as any).contentWindow.document;
      doc.open();
      doc.write(`
      <html>
        <head>
					<script type="text/javascript">
						document.addEventListener('click', function(event) {
							event.stopPropagation();
						}, true);
					</script>
					<script type="text/javascript">
						${getMapProps(id, datasets, saveAggregateX)}
					</script>
					<script type="text/javascript" src="libs/countrymap/countrymap.js"></script>
					<style>
						#${id}_access {
							display: none !important;
						}
					</style>
        </head>
        <body style="display: flex; justify-content: center;">
          <div id="${id}"></div>
        </body>
      </html>
    `);
      doc.close();
    }
  };

  React.useEffect(() => {
    const iframe = iframeRef.current;
    if ((iframe as any).contentWindow.document.readyState === 'complete') {
      writeHTMLToIframe();
    } else {
      (iframe as any).onload = writeHTMLToIframe;
    }
  }, []);

  return (
    <Flex flexDir="column">
      <Flex justifyContent="end">
        <Legends />
      </Flex>
      <iframe
        title="Map"
        ref={iframeRef}
        width={'100%'}
        height="700px"
        loading="lazy"
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
      />
    </Flex>
  );
}
