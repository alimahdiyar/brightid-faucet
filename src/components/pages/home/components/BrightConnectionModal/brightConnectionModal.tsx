import * as React from 'react';
import { useContext, useMemo } from 'react';
import { Text } from 'components/basic/Text/text.style';
import {
  BrightConnectionModalWrapper,
  CopyLink,
} from 'components/pages/home/components/BrightConnectionModal/brightConnectionModal.style';
import { UserProfileContext } from '../../../../../hooks/useUserProfile';

const BrightConnectionModal = () => {
  const userProfile = useContext(UserProfileContext);
  const verificationUrl = useMemo(() => userProfile?.verificationUrl || '', [userProfile]);
  const copyVerificationUrl = () => {
    navigator.clipboard.writeText(verificationUrl);
    alert('Copied');
  };
  return (
    <BrightConnectionModalWrapper>
      <img src={process.env.PUBLIC_URL + '/assets/images/bright-icon.png'} alt="" />
      <Text fontSize="14" className="scan-qr-text">
        Scan QR Code
      </Text>
      <img className="qr-code" src={process.env.PUBLIC_URL + '/assets/images/qr-code.png'} alt="" />
      <Text fontSize="14" className="or-text">
        or
      </Text>
      <CopyLink onClick={copyVerificationUrl}>
        <img src={process.env.PUBLIC_URL + '/assets/images/copy-link.png'} alt="" />
        <Text color="green">Copy Link</Text>
      </CopyLink>
    </BrightConnectionModalWrapper>
  );
};

export default BrightConnectionModal;
