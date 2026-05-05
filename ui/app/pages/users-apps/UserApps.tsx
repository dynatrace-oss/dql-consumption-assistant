import React from "react";
import { useIntl } from "react-intl";
import AppPage from "../../components/app-page/AppPage";
import GenericDataTable from "../../components/data-table/GenericDataTable";
import { pageDescriptionMessage, pageTitleMessage } from "./messages";
import useFetchUserApps from "./useFetchUserApps";
import useGiveTableColumns from "./useGiveTableColumns";

const UserApps: React.FC = () => {
  const { columns } = useGiveTableColumns();

  const { data, isLoading, isError, error, isSuccess, refetch } =
    useFetchUserApps();

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

export default UserApps;
