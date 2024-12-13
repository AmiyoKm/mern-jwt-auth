import useDeleteSession from "@/hooks/useDeleteSession";
import { Button } from "./ui/button";

const SessionCard = ({ session }: any) => {
  const { _id, createdAt, userAgent, isCurrent }: any = session;
  const {deleteSession } = useDeleteSession(_id)
  return (
    <div className="flex flex-col border-2 rounded-lg w-full p-4 space-y-2">
      <p className="font-bold text-xl">
        {new Date(createdAt).toLocaleString("en-US")}{" "}
        {isCurrent && " (current session)"}
      </p>
      <div className="flex justify-between items-start">
        <p className="text-muted-foreground">{userAgent}</p>
        {
            !isCurrent &&
            <Button onClick={()=> deleteSession()} variant="outline">❌</Button>
        }
      </div>
    </div>
  );
};
export default SessionCard;
