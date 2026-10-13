'use client';

import type { RefObject } from 'react';
import CertificateA from './CertificateA';

interface CertificateBProps {
  candidateName: string;
  courseName: string;
  dateIssued: string;
  certificateCode: string;
  studentId?: string;
  beltLevel?: 'Blue Belt' | 'Black Belt';
  divRef?: RefObject<HTMLDivElement>;
}

export default function CertificateB({
  beltLevel = 'Blue Belt',
  divRef,
  ...rest
}: CertificateBProps) {
  return <CertificateA {...rest} beltLevel={beltLevel} divRef={divRef}/>;
}
