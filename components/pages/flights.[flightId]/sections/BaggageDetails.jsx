import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function formatWeight(weight) {
  if (!weight) return "N/A";
  return `${weight.value} ${weight.measurementUnit}`;
}

function formatDimensions(dim) {
  if (!dim) return "N/A";
  return `${dim.length} x ${dim.width} x ${dim.height} ${dim.measurementUnit}`;
}

function BaggageSection({ title, data }) {
  if (!data) return null;

  return (
    <section>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <strong>Max Pieces:</strong> {data.maxPieces ?? "N/A"}
        </div>
        <div>
          <strong>Max Weight:</strong> {formatWeight(data.maxWeight)}
        </div>
        <div>
          <strong>Max Dimensions:</strong>{" "}
          {formatDimensions(data.maxDimensions)}
        </div>
      </div>
    </section>
  );
}

function FeeDetail({ label, fee }) {
  if (!fee) return null;
  return (
    <div>
      <Badge className="mr-2">{label}</Badge>
      {fee.feeAmount} {fee.currency} ({fee.feeType})
    </div>
  );
}

export default function BaggageDetails({ baggage }) {
  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardContent className="space-y-3 p-3">
        <BaggageSection title="Carry-on Baggage" data={baggage.carryOn} />

        <Separator />

        <BaggageSection title="Checked Baggage" data={baggage.checked} />

        {(baggage.excessWeightFee || baggage.excessPieceFee) && (
          <>
            <Separator />
            <section>
              <h3 className="mb-2 text-lg font-semibold">
                Excess Baggage Fees
              </h3>
              <div className="space-y-2 text-sm">
                <FeeDetail label="Weight Fee" fee={baggage.excessWeightFee} />
                <FeeDetail label="Piece Fee" fee={baggage.excessPieceFee} />
              </div>
            </section>
          </>
        )}

        {baggage.specialBaggage && (
          <>
            <Separator />
            <section>
              <h3 className="mb-2 text-lg font-semibold">Special Baggage</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Description:</strong>{" "}
                  {baggage.specialBaggage.description || "N/A"}
                </p>
                <p>
                  <strong>Max Weight:</strong>{" "}
                  {formatWeight(baggage.specialBaggage.maxWeight)}
                </p>
                <p>
                  <strong>Max Dimensions:</strong>{" "}
                  {formatDimensions(baggage.specialBaggage.maxDimensions)}
                </p>
              </div>
            </section>
          </>
        )}

        <Separator />
        <div className="text-right text-xs text-muted-foreground">
          All weights are shown in{" "}
          {baggage?.carryOn?.maxWeight?.measurementUnit || "kg"}. Currency:{" "}
          {baggage.currency || "N/A"}
        </div>
      </CardContent>
    </Card>
  );
}
