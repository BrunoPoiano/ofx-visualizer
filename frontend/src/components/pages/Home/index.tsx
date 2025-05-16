import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardFooter, CardTitle } from "@/components/ui/card";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { HomeProvider } from "./provider";
import { HomeFilter } from "./components/filter";

export const HomePage = () => {
  return (
    <HomeProvider>
      <section className="grid gap-3.5">
        <div>
          <ModeToggle />
        </div>
        <HomeFilter />
        <div className="grid grid-cols-[1fr_auto] gap-2.5">
          <Card>
            <CardTitle>Total Earning</CardTitle>
            <CardFooter>
              <Button>Teste</Button>
            </CardFooter>
          </Card>
          <Calendar mode="range" className="rounded-md border shadow " />
        </div>
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </section>
    </HomeProvider>
  );
};
