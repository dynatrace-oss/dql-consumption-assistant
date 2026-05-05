import { Flex } from "@dynatrace/strato-components/layouts";
import { Paragraph, Code } from "@dynatrace/strato-components/typography";
import React from "react";
import { useIntl } from "react-intl";
import AppPage from "../../components/app-page/AppPage";
import GenericDataTable from "../../components/data-table/GenericDataTable";
import { queryStringMessage, queryUserEmail } from "../messages";
import { pageTitleMessage, pageDescriptionMessage } from "./messages";
import { type TopQueriesQueryResultType } from "./types";
import useFetchTopQueriesAndApps from "./useFetchTopUsersAndApps";
import useGiveTableColumns from "./useGiveTableColumns";

const AppsQueries: React.FC = () => {
  const { columns } = useGiveTableColumns();

  const { isLoading, isError, data, error, isSuccess, refetch } =
    useFetchTopQueriesAndApps();

  const intl = useIntl();

  const expandableRowsJsx = (rowData: TopQueriesQueryResultType) => {
    return (
      <Flex padding={16} flexDirection="column">
        <Paragraph>
          {intl.formatMessage(queryStringMessage)} &nbsp;
          <Code>{rowData.Query}</Code>
        </Paragraph>
        <Paragraph>
          {intl.formatMessage(queryUserEmail)} &nbsp;
          <Code>{rowData.User}</Code>
        </Paragraph>
      </Flex>
    );
  };

  return (
    <AppPage
      error={error}
      isError={isError}
      title={intl.formatMessage(pageTitleMessage)}
      description={intl.formatMessage(pageDescriptionMessage)}
      isSuccess={isSuccess}
      isLoading={isLoading}
      handleRunQueryClick={() => {
        void refetch();
      }}
    >
      <GenericDataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        isThereExpandableRows
        expandableRowsJsx={expandableRowsJsx}
      />
    </AppPage>
  );
};

export default AppsQueries;
