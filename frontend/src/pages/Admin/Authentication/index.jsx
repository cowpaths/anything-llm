import Sidebar from "@/components/SettingsSidebar/index.jsx";
import { isMobile } from "react-device-detect";
import { useState } from "react";
import showToast from "@/utils/toast";
import ContextualSaveBar from "@/components/ContextualSaveBar/index.jsx";
import GoogleSocialLogin from "./GoogleSocialLogin/index.jsx";

export default function AdminAuthentication() {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const saveComplete = () => {
    setSaving(false);
    setHasChanges(false);
    showToast("Authentication settings updated successfully.", "success");
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10 mb-8">
            <div className="items-center flex gap-x-4">
              <p className="text-lg leading-6 font-bold text-white">
                Authentication
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
              Enable various authentication methods for your users.
            </p>
          </div>

          <div className="mb-8">
            <GoogleSocialLogin
              onChanges={() => {
                setHasChanges(true);
              }}
              persistChanges={saving}
              saveComplete={saveComplete}
            />
            <ContextualSaveBar
              showing={hasChanges}
              onSave={() => setSaving(true)}
              onCancel={() => setHasChanges(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
