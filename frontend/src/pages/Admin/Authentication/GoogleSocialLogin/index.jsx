import { useState, useEffect } from "react";
import Admin from "@/models/admin.js";
import System from "@/models/system.js";

export default function GoogleSocialLogin({
  onChanges,
  persistChanges = false,
  saveComplete,
}) {
  const [canLoginWithGoogle, setCanLoginWithGoogle] = useState({
    enabled: false,
    clientId: null,
    allowedDomain: null,
  });

  useEffect(() => {
    Admin.systemPreferencesByFields([
      "users_can_login_with_google",
      "allowed_domain",
    ])
      .then((res) =>
        setCanLoginWithGoogle({
          ...canLoginWithGoogle,
          enabled: res?.settings?.users_can_login_with_google,
          clientId: res?.settings?.users_can_login_with_google
            ? "*".repeat(20)
            : "",
          allowedDomain: res?.settings?.allowed_domain,
        })
      )
      .catch(() => setCanLoginWithGoogle({ ...canLoginWithGoogle }));
  }, []);

  useEffect(() => {
    const handleSave = async () => {
      if (persistChanges) {
        if (!canLoginWithGoogle.enabled) {
          await Admin.updateSystemPreferences({
            users_can_login_with_google: false,
            allowed_domain: "",
          });
          await System.updateSystem({
            GoogleAuthClientId: "",
          });
        } else {
          await Admin.updateSystemPreferences({
            users_can_login_with_google: canLoginWithGoogle.enabled,
            allowed_domain: canLoginWithGoogle.allowedDomain,
          });
          await System.updateSystem({
            GoogleAuthClientId: canLoginWithGoogle.clientId,
          });
        }
        saveComplete();
      }
    };
    handleSave();
  }, [persistChanges]);

  return (
    <>
      <div className="flex flex-col gap-y-1">
        <h2 className="text-base leading-6 font-bold text-white">
          Users can login with Google
        </h2>
        <p className="text-xs leading-[18px] font-base text-white/60">
          Enable this option if you want users to be able to log in using their
          Google accounts. You can restrict access to users with with with
          emails from your organization&amp;s domain.
        </p>
        <div className="mt-2">
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              name="users_can_login_with_google"
              checked={canLoginWithGoogle.enabled}
              onChange={(e) => {
                setCanLoginWithGoogle({
                  ...canLoginWithGoogle,
                  enabled: e.target.checked,
                });
                onChanges(canLoginWithGoogle);
              }}
              className="peer sr-only"
            />
            <div className="pointer-events-none peer h-6 w-11 rounded-full bg-stone-400 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border after:border-gray-600 after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-lime-300 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
          </label>
        </div>
      </div>
      {canLoginWithGoogle.enabled && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-white">
            Client ID
          </label>
          <div className="relative mt-2">
            <input
              type="password"
              name="google_client_id"
              onScroll={(e) => e.target.blur()}
              onChange={(e) => {
                setCanLoginWithGoogle({
                  ...canLoginWithGoogle,
                  clientId: e.target.value,
                });
                onChanges(canLoginWithGoogle);
              }}
              value={canLoginWithGoogle.clientId}
              min={1}
              max={300}
              className="border-none bg-theme-settings-input-bg mt-3 text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 max-w-[275px] placeholder:text-theme-settings-input-placeholder"
            />
          </div>

          <label className="block text-sm font-medium text-white mt-2">
            Organization domain
          </label>
          <p className="text-xs leading-[18px] font-base text-white/60">
            Restrict access to a specific domain, or leave empty to allow login
            with any Google account.
          </p>
          <div className="relative mt-2">
            <input
              type="text"
              placeholder="example.com"
              name="allowed_domain"
              onScroll={(e) => e.target.blur()}
              onChange={(e) => {
                setCanLoginWithGoogle({
                  ...canLoginWithGoogle,
                  allowedDomain: e.target.value,
                });
                onChanges(canLoginWithGoogle);
              }}
              value={canLoginWithGoogle.allowedDomain || ""}
              min={1}
              max={300}
              className="border-none bg-theme-settings-input-bg mt-3 text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 max-w-[275px] placeholder:text-theme-settings-input-placeholder"
            />
          </div>
        </div>
      )}
    </>
  );
}
