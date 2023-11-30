import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

const sessionWrapper = Component => {
  return async function SessionComponent(props) {
    const session = await getServerSession(authOptions);
    return <Component {...props} session={session} />;
  };
};

export default sessionWrapper;
