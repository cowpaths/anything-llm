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
        Custom API Authorization Header (TO BE REMOVED LATER__mod)
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
          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-slate-200 dark:text-slate-200 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        />
      </div>
    </div>
  );
}
