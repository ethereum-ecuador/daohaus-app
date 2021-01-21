import React, {
  useContext,
  createContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useParams } from "react-router-dom";
import { initMemberWallet } from "../utils/wallet";

export const DaoMemberContext = createContext();

export const DaoMemberProvider = ({
  daoMembers,
  address,
  overview,
  children,
}) => {
  const { daoid, daochain } = useParams();
  const [daoMember, setDaoMember] = useState(null);
  const [isMember, setIsMember] = useState(null);

  const currentMemberRef = useRef(false);
  const memberWallet = useRef(false);

  useEffect(() => {
    const checkForMember = (daoMembers) => {
      return daoMembers.find((member) => member.memberAddress === address);
    };
    if (daoMembers) {
      if (currentMemberRef.current !== address) {
        const currentMember = checkForMember(daoMembers);
        if (currentMember) {
          setDaoMember(currentMember);
          setIsMember(true);
        } else {
          setDaoMember(false);
          setIsMember(false);
        }
        currentMemberRef.current = address;
      }
    }
  }, [daoMembers, address]);
  console.log(daoMember);
  useEffect(() => {
    const assembleMemberWallet = async () => {
      try {
        const wallet = await initMemberWallet({
          memberAddress: daoMember.memberAddress,
          depositToken: overview.depositToken,
          daoAddress: daoid,
          chainID: daochain,
        });
        if (wallet) {
          setDaoMember((prevState) => ({
            ...wallet,
            ...prevState,
            hasWallet: true,
          }));
        }
        memberWallet.current = true;
      } catch (error) {
        console.error(error);
        memberWallet.current = true;
      }
    };

    if (daoMember && !memberWallet.current && overview && daochain && daoid) {
      assembleMemberWallet();
    }
  }, [daoMember, overview, daochain, daoid]);

  return (
    <DaoMemberContext.Provider
      value={{ currentMemberRef, isMember, daoMember }}
    >
      {children}
    </DaoMemberContext.Provider>
  );
};

export const useDaoMember = () => {
  const { currentMemberRef, isMember, daoMember } = useContext(
    DaoMemberContext
  );
  return { currentMemberRef, isMember, daoMember };
};
