import { useEffect, useState } from "react";
import Admin from "@/models/admin.js";

export default function CustomizeAuthHeader({
  onChanges,
  persistChanges = false,
  saveComplete,
}) {
  const [apiHeaderName, setApiHeaderName] = useState("");

  useEffect(() => {
    Admin.systemPreferencesByFields(["api_header_name"])
      .then((res) => setApiHeaderName(res?.settings?.api_header_name))
      .catch(() => setApiHeaderName(""));
  }, []);

  useEffect(() => {
    const handleSave = async () => {
      if (persistChanges) {
        console.log("apiHeaderName", apiHeaderName);
        await Admin.updateSystemPreferences({
          api_header_name: apiHeaderName,
        });
        saveComplete();
      }
    };
    handleSave();
  }, [persistChanges]);

  return (
    <div className="mt-8">
      <h2 className="text-base leading-6 font-bold text-white">
        Custom API Authorization Header
      </h2>
      <p className="text-xs leading-[18px] font-base text-white/60">
        This setting allows you to configure the header name used for the bearer
        token on requests for the API. This is useful if you need to work around
        network specific restrictions or proxies.
      </p>
      <div className="relative mt-2">
        <input
          type="text"
          value={apiHeaderName}
          onChange={(e) => {
            setApiHeaderName(e.target.value);
            onChanges(e.target.value);
          }}
          className="border-none bg-theme-settings-input-bg mt-3 text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 max-w-[275px] placeholder:text-theme-settings-input-placeholder"
        />
      </div>
    </div>
  );
}
