import React from "react";
import { useIntl } from "react-intl";
import AppPage from "../../components/app-page/AppPage";
import GenericDataTable from "../../components/data-table/GenericDataTable";
import { pageDescriptionMessage, pageTitleMessage } from "./messages";
import useFetchNotebooksUsers from "./useFetchNotebooksUsers";
import useGiveTableColumns from "./useGiveTableColumns";

const NotebooksUsers: React.FC = () => {
  /** Grab table columns */
  const { columns } = useGiveTableColumns();

  /** Get list of data, required for dataTable */
  const { isLoading, isError, data, error, isSuccess, refetch } =
    useFetchNotebooksUsers();

  const intl = useIntl();

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
      <GenericDataTable data={data} columns={columns} isLoading={isLoading} />
    </AppPage>
  );
};

export default NotebooksUsers;
