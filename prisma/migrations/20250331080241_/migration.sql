-- CreateTable
CREATE TABLE "country" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "country_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "state" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "country_id" UUID NOT NULL,

    CONSTRAINT "state_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "city" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "state_id" UUID NOT NULL,

    CONSTRAINT "city_pk" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "state" ADD CONSTRAINT "state_country_fk" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "city" ADD CONSTRAINT "city_state_fk" FOREIGN KEY ("state_id") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
