import { Loader } from "lucide-react";

function ComingSoonPage() {
  return (
    <div className="mx-auto my-[40px] flex min-h-[500px] w-[90%] items-center justify-center rounded-[20px] bg-primary/30 px-4 py-12 text-primary-foreground">
      <div className="mx-auto max-w-md rounded-2xl bg-primary p-10 text-center shadow-lg backdrop-blur-md">
        <Loader className="mx-auto animate-spin" size={50} />
        <h1 className="mb-4 text-5xl font-bold">Coming Soon</h1>
        <p className="mb-6 text-lg">
          We are working hard to bring you something amazing. Please stay tuned!
        </p>
      </div>
    </div>
  );
}

export default ComingSoonPage;
