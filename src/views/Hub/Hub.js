import React, { useEffect, useState } from 'react';
import { Box, Flex, Link, Spinner } from '@chakra-ui/react';

import { useUser } from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';
import MemberDaoList from '../../components/Hub/MemberDaoList';
import HubSignedOut from '../../components/Hub/HubSignedOut';
import HubProfileCard from '../../components/Hub/HubProfileCard';
import HubActivityFeed from '../../components/Hub/HubActivityFeed';
import TextBox from '../../components/Shared/TextBox';
import ContentBox from '../../components/Shared/ContentBox';
import { defaultTheme } from '../../themes/theme-defaults';
import HubGraphInit from '../../contexts/HubGraphInit';

const Hub = () => {
  const [user] = useUser();
  const [, setTheme] = useTheme();
  const [memberDaos, setMemberDaos] = useState();
  const [localDaos, setLocalDaos] = useState([]);
  const [localFreshDaos, setLocalFreshDaos] = useState([]);

  useEffect(() => {
    setTheme(defaultTheme);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (memberDaos) {
      setLocalDaos(
        memberDaos
          .filter((member) => member.moloch.version !== '1')
          .filter((member) => member.moloch.apiMetadata)
          .sort((a, b) => {
            return a.hubSort - b.hubSort;
          })
          .map((member) => {
            return { ...member.moloch, networkId: member.networkId };
          }),
      );
      setLocalFreshDaos(
        memberDaos
          .filter((member) => member.moloch.version !== '1')
          .filter((member) => !member.moloch.apiMetadata)
          .sort((a, b) => {
            return a.hubSort - b.hubSort;
          })
          .map((member) => {
            return { ...member.moloch, networkId: member.networkId };
          }),
      );
    }
  }, [memberDaos]);

  return (
    <Box p={6}>
      {user ? (
        <>
          <Flex wrap='wrap'>
            <Box
              w={['100%', null, null, null, '60%']}
              pr={[0, null, null, null, 6]}
              pb={6}
            >
              <HubProfileCard />
              {memberDaos && memberDaos.length > 0 && (
                <ContentBox p={6} mt={6} maxW='600px'>
                  {localDaos.length > 0 ? (
                    <Box w='100%'>
                      <MemberDaoList label={'MEMBER OF'} daos={localDaos} />
                      <Link
                        href='https://daohaus.club/explore'
                        isExternal
                        fontSize='md'
                        textTransform='uppercase'
                        color='secondary.500'
                      >
                        Explore more DAOs on DAOhaus
                      </Link>
                    </Box>
                  ) : (
                    <Box w='100%'>
                      <Flex>
                        <TextBox size='sm'>
                          You aren’t a member in any daos yet!
                        </TextBox>
                      </Flex>
                      <Flex align='center'>
                        <Box
                          w='60px'
                          h='60px'
                          border='1px dashed rgba(255, 255, 255, 0.2);'
                          borderRadius='40px'
                          my={10}
                        />
                        <TextBox ml='15px'>Your daos will show here</TextBox>
                      </Flex>
                      <Link
                        href='https://daohaus.club/explore'
                        isExternal
                        fontSize='md'
                        textTransform='uppercase'
                        color='secondary.500'
                      >
                        Explore more DAOs on DAOhaus
                      </Link>
                    </Box>
                  )}

                  {localFreshDaos.length > 0 ? (
                    <Box w='100%' mt={6}>
                      <MemberDaoList
                        label={'NEW SETUP NEEDED FOR'}
                        daos={localFreshDaos}
                      />
                    </Box>
                  ) : null}
                </ContentBox>
              )}
            </Box>

            <Box w={['100%', null, null, null, '40%']}>
              <Box
                fontSize='md'
                fontFamily='heading'
                textTransform='uppercase'
                fontWeight={700}
              >
                Recent Activity
              </Box>
              {localDaos.length > 0 ? (
                <HubActivityFeed daos={localDaos} />
              ) : (
                <Spinner />
              )}
            </Box>
          </Flex>

          {user ? (
            <HubGraphInit setHubDaos={setMemberDaos} hubDaos={memberDaos} />
          ) : null}
        </>
      ) : (
        <HubSignedOut />
      )}
    </Box>
  );
};

export default Hub;
