import {
  Button,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
} from '@chakra-ui/react';
import { utils } from 'web3';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TextBox from '../components/TextBox';
// import { useToken } from '../contexts/TokenContext';
import { useDao } from '../contexts/DaoContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { TokenService } from '../services/tokenService';
import { useTX } from '../contexts/TXContext';
import { createPoll } from '../services/pollService';
import { useUser } from '../contexts/UserContext';
// import { valToDecimalString } from '../utils/tokenValue';

const TributeInput = ({ register, setValue, getValues }) => {
  const [unlocked, setUnlocked] = useState(true);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tokenData, setTokenData] = useState([]);
  const { daoOverview } = useDao();
  const { daochain, daoid } = useParams();
  const { injectedProvider, address } = useInjectedProvider();
  const { errorToast, successToast } = useOverlay();
  const { refreshDao } = useTX();
  const { cachePoll, resolvePoll } = useUser();

  useEffect(() => {
    if (daoOverview && !tokenData.length) {
      const depositTokenAddress = daoOverview.depositToken?.tokenAddress;
      const depositToken = daoOverview.tokenBalances?.find(
        (token) =>
          token.guildBank && token.token.tokenAddress === depositTokenAddress,
      );
      const tokenArray = daoOverview.tokenBalances.filter(
        (token) =>
          token.guildBank && token.token.tokenAddress !== depositTokenAddress,
      );
      tokenArray.unshift(depositToken);
      setTokenData(
        tokenArray.map((token) => ({
          label: token.token.symbol || token.tokenAddress,
          value: token.token.tokenAddress,
          decimals: token.token.decimals,
          balance: token.tokenBalance,
        })),
      );
    }
    // eslint-disable-next-line;
  }, [daoOverview]);

  useEffect(() => {
    if (tokenData.length) {
      const depositToken = tokenData[0];
      getMax(depositToken);
      setMax();
    }
    // eslint-disable-next-line
  }, [tokenData]);

  const handleChange = async () => {
    const tributeToken = getValues('tributeToken');
    const tributeOffered = getValues('tributeOffered');
    await checkUnlocked(tributeToken, tributeOffered);
    await getMax(tributeToken);
    return true;
  };

  const unlock = async () => {
    setLoading(true);
    const token = getValues('tributeToken');
    console.log(token);
    const tokenAmount = getValues('tributeOffered');
    // ? multiply times decimals
    try {
      const poll = createPoll({ action: 'unlockToken', cachePoll })({
        daoID: daoid,
        chainID: daochain,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: `There was an error.`,
            });
            resolvePoll(txHash);
            console.error(`Could not find a matching proposal: ${error}`);
          },
          onSuccess: (txHash) => {
            successToast({
              // ? update to token symbol or name
              title: 'Tribute token unlocked',
            });
            refreshDao();
            resolvePoll(txHash);
          },
        },
      });
      TokenService({
        web3: injectedProvider,
        chainID: daochain,
        tokenAddress: token,
      })('approve')([daoid, tokenAmount], address, poll);
      setUnlocked(true);
    } catch (err) {
      console.log('error:', err);
    }
    setLoading(false);
  };

  const checkUnlocked = async (token, amount) => {
    console.log('check', token, amount);
    if (amount === '' || !token) {
      // return;
    }
    const tokenContract = TokenService({
      chainID: daochain,
      tokenAddress: token,
    });
    const amountApproved = await tokenContract('allowance')({
      accountAddr: address,
      contractAddr: daoid,
    });
    const isUnlocked = amountApproved > amount;
    setUnlocked(isUnlocked);
  };

  const getMax = async (token) => {
    console.log(token);
    const tokenContract = TokenService({
      chainID: daochain,
      tokenAddress: token,
    });
    const max = await tokenContract('balanceOf')(address);
    setBalance(max);
  };

  const setMax = async () => {
    setValue('tributeOffered', balance);
  };

  return (
    <>
      <TextBox as={FormLabel} size='xs'>
        Token Tribute
      </TextBox>
      <InputGroup>
        {!unlocked && (
          <Button
            onClick={() => unlock()}
            isLoading={loading}
            size='xs'
            position='absolute'
            right='0'
            bottom='-10px'
          >
            Unlock
          </Button>
        )}
        <Button
          onClick={() => setMax()}
          size='xs'
          variant='outline'
          position='absolute'
          right='0'
          top='-30px'
        >
          Max: {balance && parseFloat(utils.fromWei(balance)).toFixed(4)}
        </Button>
        <Input
          name='tributeOffered'
          placeholder='0'
          mb={5}
          ref={register({
            pattern: {
              value: /[0-9]/,
              message: 'Tribute must be a number',
            },
          })}
          color='white'
          focusBorderColor='secondary.500'
          onChange={handleChange}
        />
        <InputRightAddon background='primary.500' p={0}>
          <Select
            name='tributeToken'
            defaultValue='0xd0a1e359811322d97991e03f863a0c30c2cf029c'
            ref={register}
            onChange={handleChange}
            color='white'
            background='primary.500'
          >
            {' '}
            {tokenData.map((token, idx) => (
              <option key={idx} default={!idx} value={token.value}>
                {token.label}
              </option>
            ))}
          </Select>
        </InputRightAddon>
      </InputGroup>
    </>
  );
};

export default TributeInput;