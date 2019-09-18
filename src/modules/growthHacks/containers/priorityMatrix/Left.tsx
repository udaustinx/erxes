import gql from 'graphql-tag';
import { IFilterParams } from 'modules/boards/types';
import { withProps } from 'modules/common/utils';
import Left from 'modules/growthHacks/components/priorityMatrix/Left';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { queries } from '../../graphql';

type Props = {
  queryParams: any;
};

type FinalProps = {
  growthHacksQuery: any;
  growthHacksPriorityMatrixQuery: any;
} & Props;

class LeftContainer extends React.Component<FinalProps> {
  render() {
    const { growthHacksQuery, growthHacksPriorityMatrixQuery } = this.props;

    const growthHacksPriorityMatrix =
      growthHacksPriorityMatrixQuery.growthHacksPriorityMatrix || [];
    const growthHacks = growthHacksQuery.growthHacks || [];

    const extendedProps = {
      ...this.props,
      growthHacksPriorityMatrix,
      growthHacks
    };

    return <Left {...extendedProps} />;
  }
}

interface IGrowthHackFilterParams extends IFilterParams {
  pipelineId?: string;
}

const getFilterParams = (queryParams: IGrowthHackFilterParams) => {
  if (!queryParams) {
    return {};
  }

  return {
    pipelineId: queryParams.pipelineId,
    search: queryParams.search,
    assignedUserIds: queryParams.assignedUserIds,
    nextDay: queryParams.nextDay,
    nextWeek: queryParams.nextWeek,
    nextMonth: queryParams.nextMonth,
    noCloseDate: queryParams.noCloseDate,
    overdue: queryParams.overdue
  };
};

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.growthHacksPriorityMatrix), {
      name: 'growthHacksPriorityMatrixQuery',
      options: ({ queryParams = {} }) => ({
        variables: {
          ...getFilterParams(queryParams)
        }
      })
    }),
    graphql<Props>(gql(queries.growthHacks), {
      name: 'growthHacksQuery',
      options: ({ queryParams = {} }) => ({
        variables: {
          ...getFilterParams(queryParams),

          sortField: queryParams.sortField,
          sortDirection: parseInt(queryParams.sortDirection, 10)
        }
      })
    })
  )(LeftContainer)
);
