import { documentsClient, type DocumentMetaData } from '@dynatrace-sdk/client-document';
import { useState, useEffect } from 'react';

type UseDocumentsMapProps = {
  filter: string; // e.g. "type=='dashboard'" or "type=='notebook'"
};

const useDocumentsMap = ({ filter }: UseDocumentsMapProps) => {
  const [documentsMap, setDocumentsMap] = useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const result = await documentsClient.listDocuments({
          filter,
          pageSize: 1000, //The page size which defines the requested number of result entries. Maximum is 1000 result entries. If omitted, 20 results will return.
        });

        const map = new Map<string, string>();
        result.documents.forEach((doc: DocumentMetaData) => {
          map.set(doc.id, doc.name);
        });

        setDocumentsMap(map);
      } catch (err) {
        console.error('Failed to load documents', err);
        throw new Error('Failed to load documents');
      } finally {
        setIsLoading(false);
      }
    };

    void loadDocuments();
  }, [filter]);

  return {
    documentsMap,
    isLoading,
  };
};

export default useDocumentsMap;
