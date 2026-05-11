"use client";

import CustomModal from "@/common/modal";
import { RegistrationForm } from "@/forms/registration.form";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationModal({ isOpen, onClose }: IProps) {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Create account">
      <RegistrationForm onClose={onClose} />
    </CustomModal>
  );
}
