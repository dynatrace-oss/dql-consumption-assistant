import { timeframeConverterBasedOnType } from '../utils/helpers';
import type { QueryTimeFrameType } from '../interfaces/Interfaces';

/**
 * This file contains all the queries that the Each Section & it's Sub-Section requires
 * All the Query functions, requires Timeframe, which will be taken from UI
 */

/**
 * Dashboards
 */
export const topDashboards = (timeframe: QueryTimeFrameType) => `
fetch dt.system.query_executions, ${timeframeConverterBasedOnType(timeframe)}
| filter client.application_context == "dynatrace.dashboards"
| filter isNotNull(scanned_bytes.included)
| filter isNotNull(scanned_bytes.on_demand)
| parse client.source, """DATA 'dashboard/' STRING:dashboard_id"""
| fields bucket, table, scanned_bytes, scanned_bytes.included, scanned_bytes.on_demand, query_string, client.application_context, client.source, user.email, user.id, dashboard_id = if(isNull(dashboard_id), client.source , else:dashboard_id)
| fieldsAdd scanned_gib_total = scanned_bytes/1024/1024/1024
| fieldsAdd scanned_gib_included = scanned_bytes.included/1024/1024/1024
| fieldsAdd scanned_gib_on_demand = scanned_bytes.on_demand/1024/1024/1024
| filter scanned_gib_total > 10
| summarize {num_executions = count(), avg_scanned = avg(scanned_gib_total), total_scanned = sum(scanned_gib_total), scanned_included = sum(scanned_gib_included), scanned_on_demand = sum(scanned_gib_on_demand)}, by: {dashboard_id,table,bucket}
| sort scanned_on_demand desc
`;

export const dashboardsUsers = (timeframe: QueryTimeFrameType) => `
fetch dt.system.query_executions, ${timeframeConverterBasedOnType(timeframe)}
| filter client.application_context == "dynatrace.dashboards"
| filter isNotNull(scanned_bytes.included)
| filter isNotNull(scanned_bytes.on_demand)
| parse client.source, """DATA 'dashboard/' STRING:dashboard_id"""
| fields bucket, table, scanned_bytes, scanned_bytes.included, scanned_bytes.on_demand, query_string, client.application_context, client.source, user.email, user.id, dashboard_id = if(isNull(dashboard_id), client.source , else:dashboard_id)
| fieldsRename userEmail = user.email
| fieldsAdd scanned_gib_total = scanned_bytes/1024/1024/1024
| fieldsAdd scanned_gib_included = scanned_bytes.included/1024/1024/1024
| fieldsAdd scanned_gib_on_demand = scanned_bytes.on_demand/1024/1024/1024
| filter scanned_gib_total > 10
| summarize {num_executions = count(), avg_scanned = avg(scanned_gib_total), total_scanned = sum(scanned_gib_total), scanned_included = sum(scanned_gib_included), scanned_on_demand = sum(scanned_gib_on_demand)}, by: {dashboard_id,table,bucket,userEmail}
| sort scanned_on_demand desc
`;

export const dashboardsQueries = (timeframe: QueryTimeFrameType) => `
fetch dt.system.query_executions, ${timeframeConverterBasedOnType(timeframe)}
| filter client.application_context == "dynatrace.dashboards"
| filter isNotNull(scanned_bytes.included)
| filter isNotNull(scanned_bytes.on_demand)
| parse client.source, """DATA 'dashboard/' STRING:dashboard_id"""
| fields bucket, table, scanned_bytes, scanned_bytes.included, scanned_bytes.on_demand, query_string, client.application_context, client.source, user.email, user.id, dashboard_id = if(isNull(dashboard_id), client.source , else:dashboard_id)
| fieldsRename userEmail = user.email
| fieldsAdd scanned_gib_total = scanned_bytes/1024/1024/1024
| fieldsAdd scanned_gib_included = scanned_bytes.included/1024/1024/1024
| fieldsAdd scanned_gib_on_demand = scanned_bytes.on_demand/1024/1024/1024
| filter scanned_gib_total > 10
| summarize {num_executions = count(), avg_scanned = avg(scanned_gib_total), total_scanned = sum(scanned_gib_total), scanned_included = sum(scanned_gib_included), scanned_on_demand = sum(scanned_gib_on_demand)}, by: {dashboard_id,table,bucket,userEmail,query_string}
| sort scanned_on_demand desc
`;

/**
 * Notebooks
 */

export const topNoteBooks = (timeframe: QueryTimeFrameType) => `
fetch dt.system.query_executions, ${timeframeConverterBasedOnType(timeframe)}
| filter client.application_context == "dynatrace.notebooks"
| filter isNotNull(scanned_bytes.included)
| filter isNotNull(scanned_bytes.on_demand)
| parse client.source, """DATA 'notebook/' STRING:notebook_id"""
| fields bucket, table, scanned_bytes, scanned_bytes.included, scanned_bytes.on_demand, query_string, client.application_context, client.source, user.email, user.id, notebook_id = if(isNull(notebook_id), client.source , else:notebook_id)
| fieldsAdd scanned_gib_total = scanned_bytes/1024/1024/1024
| fieldsAdd scanned_gib_included = scanned_bytes.included/1024/1024/1024
| fieldsAdd scanned_gib_on_demand = scanned_bytes.on_demand/1024/1024/1024
| filter scanned_gib_total > 10
| summarize {num_executions = count(), avg_scanned = avg(scanned_gib_total), total_scanned = sum(scanned_gib_total), scanned_included = sum(scanned_gib_included), scanned_on_demand = sum(scanned_gib_on_demand)}, by: {notebook_id,table,bucket}
| sort scanned_on_demand desc
`;

export const notebooksUsers = (timeframe: QueryTimeFrameType) => `
fetch dt.system.query_executions, ${timeframeConverterBasedOnType(timeframe)}
| filter client.application_context == "dynatrace.notebooks"
| filter isNotNull(scanned_bytes.included)
| filter isNotNull(scanned_bytes.on_demand)
| parse client.source, """DATA 'notebook/' STRING:notebook_id"""
| fields bucket, table, scanned_bytes, scanned_bytes.included, scanned_bytes.on_demand, query_string, client.application_context, client.source, user.email, user.id, notebook_id = if(isNull(notebook_id), client.source , else:notebook_id)
| fieldsRename userEmail = user.email
| fieldsAdd scanned_gib_total = scanned_bytes/1024/1024/1024
| fieldsAdd scanned_gib_included = scanned_bytes.included/1024/1024/1024
| fieldsAdd scanned_gib_on_demand = scanned_bytes.on_demand/1024/1024/1024
| filter scanned_gib_total > 10
| summarize {num_executions = count(), avg_scanned = avg(scanned_gib_total), total_scanned = sum(scanned_gib_total), scanned_included = sum(scanned_gib_included), scanned_on_demand = sum(scanned_gib_on_demand)}, by: {notebook_id,table,bucket,userEmail}
| sort scanned_on_demand desc
`;

export const notebooksQueries = (timeframe: QueryTimeFrameType) => `
fetch dt.system.query_executions, ${timeframeConverterBasedOnType(timeframe)}
| filter client.application_context == "dynatrace.notebooks"
| filter isNotNull(scanned_bytes.included)
| filter isNotNull(scanned_bytes.on_demand)
| parse client.source, """DATA 'notebook/' STRING:notebook_id"""
| fields bucket, table, scanned_bytes, scanned_bytes.included, scanned_bytes.on_demand, query_string, client.application_context, client.source, user.email, user.id, notebook_id = if(isNull(notebook_id), client.source , else:notebook_id)
| fieldsRename userEmail = user.email
| fieldsAdd scanned_gib_total = scanned_bytes/1024/1024/1024
| fieldsAdd scanned_gib_included = scanned_bytes.included/1024/1024/1024
| fieldsAdd scanned_gib_on_demand = scanned_bytes.on_demand/1024/1024/1024
| filter scanned_gib_total > 10
| summarize {num_executions = count(), avg_scanned = avg(scanned_gib_total), total_scanned = sum(scanned_gib_total), scanned_included = sum(scanned_gib_included), scanned_on_demand = sum(scanned_gib_on_demand)}, by: {notebook_id,table,bucket,userEmail,query_string}
| sort scanned_on_demand desc
`;

/**
 * Users
 */

export const topUsers = (timeframe: QueryTimeFrameType) => `
fetch dt.system.query_executions, ${timeframeConverterBasedOnType(timeframe)}
| filter isNotNull(client.application_context)
| filter isNotNull(scanned_bytes.included)
| filter isNotNull(scanned_bytes.on_demand)
| fields bucket, table, scanned_bytes, scanned_bytes.included, scanned_bytes.on_demand, query_string, client.application_context, client.source, user.email, user.id
| fieldsRename userEmail = user.email
| fieldsAdd scanned_gib_total = scanned_bytes/1024/1024/1024
| fieldsAdd scanned_gib_included = scanned_bytes.included/1024/1024/1024
| fieldsAdd scanned_gib_on_demand = scanned_bytes.on_demand/1024/1024/1024
| filter scanned_gib_total > 10
| summarize {num_executions = count(), avg_scanned = avg(scanned_gib_total), total_scanned = sum(scanned_gib_total), scanned_included = sum(scanned_gib_included), scanned_on_demand = sum(scanned_gib_on_demand)}, by: {userEmail,table,bucket}
| sort scanned_on_demand desc
`;

export const usersApps = (timeframe: QueryTimeFrameType) => `
fetch dt.system.query_executions, ${timeframeConverterBasedOnType(timeframe)}
| filter isNotNull(client.application_context)
| filter isNotNull(scanned_bytes.included)
| filter isNotNull(scanned_bytes.on_demand)
| fields bucket, table, scanned_bytes, scanned_bytes.included, scanned_bytes.on_demand, query_string, client.application_context, client.source, user.email, user.id
| fieldsRename userEmail = user.email, dtApp = client.application_context
| fieldsAdd scanned_gib_total = scanned_bytes/1024/1024/1024
| fieldsAdd scanned_gib_included = scanned_bytes.included/1024/1024/1024
| fieldsAdd scanned_gib_on_demand = scanned_bytes.on_demand/1024/1024/1024
| filter scanned_gib_total > 10
| summarize {num_executions = count(), avg_scanned = avg(scanned_gib_total), total_scanned = sum(scanned_gib_total), scanned_included = sum(scanned_gib_included), scanned_on_demand = sum(scanned_gib_on_demand)}, by: {userEmail,table,bucket,dtApp}
| sort scanned_on_demand desc
`;

export const usersQueries = (timeframe: QueryTimeFrameType) => `
fetch dt.system.query_executions, ${timeframeConverterBasedOnType(timeframe)}
| filter isNotNull(client.application_context)
| filter isNotNull(scanned_bytes.included)
| filter isNotNull(scanned_bytes.on_demand)
| fields bucket, table, scanned_bytes, scanned_bytes.included, scanned_bytes.on_demand, query_string, client.application_context, client.source, user.email, user.id
| fieldsRename userEmail = user.email, dtApp = client.application_context
| fieldsAdd scanned_gib_total = scanned_bytes/1024/1024/1024
| fieldsAdd scanned_gib_included = scanned_bytes.included/1024/1024/1024
| fieldsAdd scanned_gib_on_demand = scanned_bytes.on_demand/1024/1024/1024
| filter scanned_gib_total > 10
| summarize {num_executions = count(), avg_scanned = avg(scanned_gib_total), total_scanned = sum(scanned_gib_total), scanned_included = sum(scanned_gib_included), scanned_on_demand = sum(scanned_gib_on_demand)}, by: {userEmail,table,bucket,dtApp,query_string}
| sort scanned_on_demand desc
`;

/**
 * Apps
 */

export const topApps = (timeframe: QueryTimeFrameType) => `
fetch dt.system.query_executions, ${timeframeConverterBasedOnType(timeframe)}
| filter isNotNull(client.application_context)
| filter isNotNull(scanned_bytes.included)
| filter isNotNull(scanned_bytes.on_demand)
| fields bucket, table, scanned_bytes, scanned_bytes.included, scanned_bytes.on_demand, query_string, client.application_context,client.function_context, client.source, user.email, user.id
| fieldsRename dtApp = client.application_context, functionContext = client.function_context
| fieldsAdd scanned_gib_total = scanned_bytes/1024/1024/1024
| fieldsAdd scanned_gib_included = scanned_bytes.included/1024/1024/1024
| fieldsAdd scanned_gib_on_demand = scanned_bytes.on_demand/1024/1024/1024
| filter scanned_gib_total > 10
| summarize {num_executions = count(), avg_scanned = avg(scanned_gib_total), total_scanned = sum(scanned_gib_total), scanned_included = sum(scanned_gib_included), scanned_on_demand = sum(scanned_gib_on_demand)}, by: {dtApp,table,bucket,functionContext}
| sort scanned_on_demand desc
`;

export const appsUsers = (timeframe: QueryTimeFrameType) => `
fetch dt.system.query_executions, ${timeframeConverterBasedOnType(timeframe)}
| filter isNotNull(client.application_context)
| filter isNotNull(scanned_bytes.included)
| filter isNotNull(scanned_bytes.on_demand)
| fields bucket, table, scanned_bytes, scanned_bytes.included, scanned_bytes.on_demand, query_string, client.application_context,client.function_context, client.source, user.email, user.id
| fieldsRename userEmail = user.email, dtApp = client.application_context, functionContext = client.function_context
| fieldsAdd scanned_gib_total = scanned_bytes/1024/1024/1024
| fieldsAdd scanned_gib_included = scanned_bytes.included/1024/1024/1024
| fieldsAdd scanned_gib_on_demand = scanned_bytes.on_demand/1024/1024/1024
| filter scanned_gib_total > 10
| summarize {num_executions = count(), avg_scanned = avg(scanned_gib_total), total_scanned = sum(scanned_gib_total), scanned_included = sum(scanned_gib_included), scanned_on_demand = sum(scanned_gib_on_demand)}, by: {dtApp,table,bucket,functionContext,userEmail}
| sort scanned_on_demand desc
`;

export const appsQueries = (timeframe: QueryTimeFrameType) => `
fetch dt.system.query_executions, ${timeframeConverterBasedOnType(timeframe)}
| filter isNotNull(client.application_context)
| filter isNotNull(scanned_bytes.included)
| filter isNotNull(scanned_bytes.on_demand)
| fields bucket, table, scanned_bytes, scanned_bytes.included, scanned_bytes.on_demand, query_string, client.application_context,client.function_context, client.source, user.email, user.id
| fieldsRename userEmail = user.email, dtApp = client.application_context, functionContext = client.function_context
| fieldsAdd scanned_gib_total = scanned_bytes/1024/1024/1024
| fieldsAdd scanned_gib_included = scanned_bytes.included/1024/1024/1024
| fieldsAdd scanned_gib_on_demand = scanned_bytes.on_demand/1024/1024/1024
| filter scanned_gib_total > 10
| summarize {num_executions = count(), avg_scanned = avg(scanned_gib_total), total_scanned = sum(scanned_gib_total), scanned_included = sum(scanned_gib_included), scanned_on_demand = sum(scanned_gib_on_demand)}, by: {dtApp,userEmail,table,bucket,functionContext,query_string}
| sort scanned_on_demand desc
`;

/**
 * Queries
 */

export const topQueries = (timeframe: QueryTimeFrameType) => `
fetch dt.system.query_executions, ${timeframeConverterBasedOnType(timeframe)}
| filter isNotNull(client.application_context)
| filter isNotNull(scanned_bytes.included)
| filter isNotNull(scanned_bytes.on_demand)
| fields timestamp, client.application_context, table, bucket, user.email, query_string, scanned_bytes, scanned_bytes.included, scanned_bytes.on_demand
| fieldsRename userEmail = user.email, dtApp = client.application_context
| fieldsAdd total_scanned = scanned_bytes/1024/1024/1024
| fieldsAdd scanned_included = scanned_bytes.included/1024/1024/1024
| fieldsAdd scanned_on_demand = scanned_bytes.on_demand/1024/1024/1024
| fieldsRemove scanned_bytes, scanned_bytes.included, scanned_bytes.on_demand
| filter total_scanned > 10
| sort scanned_on_demand desc
| limit 50
`;

export const queriesBestPractices = (timeframe: QueryTimeFrameType) => `
fetch dt.system.query_executions, ${timeframeConverterBasedOnType(timeframe)}
| filter isNotNull(client.application_context)
| filter isNotNull(scanned_bytes.included)
| filter isNotNull(scanned_bytes.on_demand)
| filter (not matchesPhrase(query_string, "filter") and not matchesPhrase(query_string, "scanLimit") and not matchesPhrase(query_string, "samplingRatio")) or matchesPhrase(query_string, "scanLimitGBytes:-1")
| fields bucket, table, scanned_bytes, scanned_bytes.included, scanned_bytes.on_demand, query_string, client.application_context, client.source, user.email, user.id
| fieldsRename userEmail = user.email, dtApp = client.application_context
| fieldsAdd scanned_gib_total = scanned_bytes/1024/1024/1024
| fieldsAdd scanned_gib_included = scanned_bytes.included/1024/1024/1024
| fieldsAdd scanned_gib_on_demand = scanned_bytes.on_demand/1024/1024/1024
| filter scanned_gib_total > 10
| summarize {num_executions = count(), avg_scanned = avg(scanned_gib_total), total_scanned = sum(scanned_gib_total), scanned_included = sum(scanned_gib_included), scanned_on_demand = sum(scanned_gib_on_demand)}, by: {dtApp,table,bucket,userEmail,query_string}
| sort scanned_on_demand desc
`;
