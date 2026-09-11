"use client";

const PORTONE_SDK_URL =
  "https://cdn.portone.io/v2/browser-sdk.js";

let loadingPromise:
  Promise<void> | null =
  null;

export function loadPortOneSdk() {
  if (
    typeof window ===
      "undefined"
  ) {
    return Promise.reject(
      new Error(
        "브라우저 환경에서만 결제 모듈을 불러올 수 있습니다."
      )
    );
  }

  if (
    window.PortOne
  ) {
    return Promise.resolve();
  }

  if (
    loadingPromise
  ) {
    return loadingPromise;
  }

  loadingPromise =
    new Promise<void>(
      (
        resolve,
        reject
      ) => {
        let settled =
          false;

        const finishWithError =
          (
            message:
              string
          ) => {
            if (
              settled
            ) {
              return;
            }

            settled =
              true;

            loadingPromise =
              null;

            reject(
              new Error(
                message
              )
            );
          };

        const finishWithSuccess =
          () => {
            if (
              settled
            ) {
              return;
            }

            if (
              !window.PortOne
            ) {
              finishWithError(
                "포트원 결제 모듈을 확인하지 못했습니다."
              );

              return;
            }

            settled =
              true;

            resolve();
          };

        const existingScript =
          document.querySelector<HTMLScriptElement>(
            `script[src="${PORTONE_SDK_URL}"]`
          );

        if (
          existingScript
        ) {
          existingScript.addEventListener(
            "load",
            finishWithSuccess,
            {
              once:
                true,
            }
          );

          existingScript.addEventListener(
            "error",
            () =>
              finishWithError(
                "포트원 결제 모듈을 불러오지 못했습니다."
              ),
            {
              once:
                true,
            }
          );
        } else {
          const script =
            document.createElement(
              "script"
            );

          script.src =
            PORTONE_SDK_URL;

          script.async =
            true;

          script.addEventListener(
            "load",
            finishWithSuccess,
            {
              once:
                true,
            }
          );

          script.addEventListener(
            "error",
            () =>
              finishWithError(
                "포트원 결제 모듈을 불러오지 못했습니다."
              ),
            {
              once:
                true,
            }
          );

          document.head.appendChild(
            script
          );
        }

        window.setTimeout(
          () => {
            if (
              window.PortOne
            ) {
              finishWithSuccess();
            } else {
              finishWithError(
                "포트원 결제 모듈을 불러오는 시간이 초과되었습니다."
              );
            }
          },
          15000
        );
      }
    );

  return loadingPromise;
}