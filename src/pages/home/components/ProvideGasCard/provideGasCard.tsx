import React from 'react';
import { LightOutlinedButton } from 'components/basic/Button/button';
import RoutePath from '../../../../routes';
import { Link } from 'react-router-dom';
import Icon from 'components/basic/Icon/Icon';

const ProvideGasCard = () => {
  return (
    <div className="provide-gas pb-4 sm:pb-0 w-full flex flex-col sm:flex-row items-center bg-gray40 border-2 border-gray30 rounded-xl">
      <section className={'flex flex-col md:flex-row'}>
        <div className="chain p-5 lg:w-36 xl:w-40 sm:border-r-2 border-r-gray30">
          <div className="chain__name flex mb-4 text-white">
            MATIC{' '}
            <Icon
              className="ml-2"
              iconSrc="https://bafybeih472n6xodygw34uoq7cvzfjvaj4xtp5xj7ikwq5zwqjwf7zvcu2a.ipfs.w3s.link/4.svg"
              width="auto"
              height="22px"
            />
          </div>
          <p className="chain__info text-xs text-gray90 flex">
            balance: <span className="chain__info__balance text-white ml-1">1,322</span>
          </p>
        </div>
        <div className="chain p-5 lg:w-36 xl:w-40 sm:border-r-2 border-r-gray30">
          <div className="chain__name flex mb-4 text-white">
            MATIC{' '}
            <Icon
              className="ml-2"
              iconSrc="https://bafybeif5f5axdngc4h2rtxqyphoyizxkntr56gt3poqw2puorvplob6yfa.ipfs.w3s.link/5.svg"
              width="auto"
              height="22px"
            />
          </div>
          <p className="chain__info text-xs text-gray90 flex">
            balance: <span className="chain__info__balance text-white ml-1">1,322</span>
          </p>
        </div>
      </section>
      <section className={'flex flex-col md:flex-row'}>
        <div className="chain p-5 lg:w-36 xl:w-40 sm:border-r-2 border-r-gray30">
          <div className="chain__name flex mb-4 text-white">
            MATIC{' '}
            <Icon
              className="ml-2"
              iconSrc="https://bafybeidileki3i5uyuhkyegrkyiv5cpq43ot2brb6b2kgitkn6e65gffcq.ipfs.w3s.link/ipfs/bafybeidileki3i5uyuhkyegrkyiv5cpq43ot2brb6b2kgitkn6e65gffcq/250.svg"
              width="auto"
              height="22px"
            />
          </div>
          <p className="chain__info text-xs text-gray90 flex">
            balance: <span className="chain__info__balance text-white ml-1">1,322</span>
          </p>
        </div>
        <div className="chain p-5 lg:w-36 xl:w-40 sm:border-r-2 border-r-gray30">
          <div className="chain__name flex mb-4 text-white">
            MATIC{' '}
            <Icon
              className="ml-2"
              iconSrc="https://bafybeih472n6xodygw34uoq7cvzfjvaj4xtp5xj7ikwq5zwqjwf7zvcu2a.ipfs.w3s.link/4.svg"
              width="auto"
              height="22px"
            />
          </div>
          <p className="chain__info text-xs text-gray90 flex">
            balance: <span className="chain__info__balance text-white ml-1">1,322</span>
          </p>
        </div>
      </section>
      <Link className="m-auto" to={RoutePath.FUND}>
        <LightOutlinedButton className={'!bg-gray00 !w-48 lg:!w-60'} fontSize="14" height="46px">
          Provide Gas Fee
        </LightOutlinedButton>
      </Link>
    </div>
  );
};

export default ProvideGasCard;
