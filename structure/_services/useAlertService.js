import { create } from "zustand";

export { useAlertService };

// alert state store
const alertStore = create(() => ({}));

function useAlertService() {
  const { alert } = alertStore();

  return {
    alert,
    success: (message, showAfterRedirect = false) => {
      const type = "alert-success";
      alertStore.setState({
        alert: { type, message, showAfterRedirect },
      });
    },
    error: (message, showAfterRedirect = false) => {
      const type = "alert-danger";
      alertStore.setState({
        alert: { type, message, showAfterRedirect },
      });
    },
    clear: () => {
      alertStore.setState(state => {
        let alert = state.alert;

        // if showAfterRedirect is true the alert is kept for
        // one route change (e.g. after successful registration)
        if (alert?.showAfterRedirect) {
          alert.showAfterRedirect = false;
        } else {
          alert = undefined;
        }

        return { alert };
      });
    },
  };
}
