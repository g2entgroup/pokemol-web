import React, { useEffect, useState } from 'react';
import { Flex, Text, Spinner } from '@chakra-ui/react';

import ProposalCard from './proposalCard';
import { determineUnreadProposalList } from '../utils/proposalUtils';
import { useDaoMember } from '../contexts/DaoMemberContext';
import Paginator from './paginator';
import ProposalFilters from './proposalFilters';
import ListSort from './listSort';
import { sortOptions } from '../utils/proposalContent';
import ContentBox from './ContentBox';

const ProposalsList = ({ proposals, customTerms }) => {
  const { daoMember } = useDaoMember();
  const [listProposals, setListProposals] = useState(proposals);
  const [pageProposals, setPageProposals] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [filter, setFilter] = useState(null);
  const [sort, setSort] = useState(null);

  useEffect(() => {
    const filterAndSortProposals = () => {
      let filteredProposals = proposals;
      if (sort && filter) {
        filteredProposals = proposals
          .filter((prop) => {
            if (filter.value === 'All') {
              return true;
            }
            if (filter.value === 'Action Needed') {
              const unread = determineUnreadProposalList(
                prop,
                daoMember.shares > 0,
                daoMember.memberAddress,
              );
              return unread.unread;
            } else {
              return prop[filter.type] === filter.value;
            }
          })
          .sort((a, b) => {
            if (sort.value === 'submissionDateAsc') {
              return +a.createdAt - +b.createdAt;
            } else if (sort.value === 'voteCountDesc') {
              return b.votes.length - a.votes.length;
            } else {
              return +b.createdAt - +a.createdAt;
            }
          });
        if (
          sort.value !== 'submissionDateAsc' &&
          sort.value !== 'submissionDateDesc'
        ) {
          filteredProposals = filteredProposals.sort((a, b) => {
            return a.status === sort.value ? -1 : 1;
          });
        }
      }
      setListProposals(filteredProposals);
    };
    if (proposals?.length) {
      filterAndSortProposals();
      setIsLoaded(true);
    }
  }, [proposals, sort, filter]);

  return (
    <>
      <Flex wrap='wrap'>
        <ProposalFilters
          filter={filter}
          setFilter={setFilter}
          setSort={setSort}
          proposals={proposals}
        />
        <ListSort sort={sort} setSort={setSort} options={sortOptions} />
      </Flex>
      {isLoaded &&
        pageProposals?.map((proposal) => {
          return (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              customTerms={customTerms}
            />
          );
        })}

      {isLoaded ? (
        <Paginator
          perPage={3}
          setRecords={setPageProposals}
          allRecords={listProposals}
        />
      ) : (
        <Flex w='100%' h='250px' align='center' justify='center'>
          <Spinner
            thickness='6px'
            speed='0.45s'
            emptyColor='whiteAlpha.300'
            color='primary.500'
            size='xl'
            mt={40}
          />
        </Flex>
      )}
      {listProposals && !listProposals.length && (
        <ContentBox mt={6} p={3}>
          <Text>No Proposals here yet</Text>
        </ContentBox>
      )}
    </>
  );
};

export default ProposalsList;
