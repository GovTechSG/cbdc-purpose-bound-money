import { SecondaryLinkButton } from "@web/components/secondary-link-button";
import featureDisbursementImage from "@web/public/images/features/feature-auto-disbursement.webp";
import featureDashboardImage from "@web/public/images/features/feature-dashboard.webp";
import featureManageImage from "@web/public/images/features/feature-manage.webp";
import featureSendImage from "@web/public/images/features/feature-send.webp";
import Image from "next/image";
import React from "react";

export default function Features() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20 ">
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h2 className="h2 mb-4">Digital money now with rules</h2>
            <p className="text-normal md:text-xl text-gray-400">
              When you send a PBM, you transmit money imbued with specific rules
              governing its intended purpose.
            </p>

            <div className="flex justify-center mt-10">
              <div
                className="relative flex justify-center items-center min-w-[60rem] sm:min-w-full"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <SecondaryLinkButton
                  href={process.env.NEXT_PUBLIC_UX_FEATURE_DECK_URL!}
                >
                  Download Feature Screens Deck
                </SecondaryLinkButton>
              </div>
            </div>
          </div>

          <div className="grid gap-20">
            {/* 1st item */}
            <div className="md:grid md:grid-cols-12 md:gap-6 items-center">
              {/* Image */}
              <div
                className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-5 lg:col-span-6 mb-8 md:mb-0 md:order-1"
                data-aos="fade-up"
              >
                <Image
                  className="max-w-full mx-auto md:max-w-none h-auto"
                  src={featureDashboardImage}
                  quality={100}
                  priority
                  alt="Dashboard of the Purpose Bound Money (PBM) portal"
                />
              </div>
              {/* Content */}
              <div
                className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-7 lg:col-span-6"
                data-aos="fade-right"
              >
                <div className="md:pr-4 lg:pr-12 xl:pr-16">
                  <h3 className="h3 mb-3">Many payments, one dashboard</h3>
                  <p className="text-normal md:text-lg text-gray-400 mb-4">
                    As a merchant, you can track the lifecycle of each PBM
                    transaction on the blockchain. Once an escrow payment
                    matures, you see them instantly reflected on your dashboard,
                    ready for your next move – unwrap the underlying money from
                    the PBM into your wallet. Or, you could refund a payment to
                    the payer.
                  </p>
                </div>
              </div>
            </div>

            <div className="md:grid md:grid-cols-12 md:gap-6 items-center">
              {/* Image */}
              <div
                className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-5 lg:col-span-6 mb-8 md:mb-0 rtl"
                data-aos="fade-up"
              >
                <Image
                  className="max-w-full mx-auto md:max-w-none h-auto"
                  src={featureSendImage}
                  quality={100}
                  priority
                  alt="Wrap and send digital money with PBM"
                />
              </div>
              {/* Content */}
              <div
                className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-7 lg:col-span-6"
                data-aos="fade-left"
              >
                <div className="md:pl-4 lg:pl-12 xl:pl-16">
                  <h3 className="h3 mb-3">Wrap and send your digital money</h3>
                  <p className="text-normal md:text-lg text-gray-400 mb-4">
                    Wrap your digital money into PBM tokens, specify the holding
                    duration as a condition, and send it to the recipient. Only
                    when the payment has matured after the specified duration,
                    the recipients can unwrap their payments into their wallet.
                  </p>
                </div>
              </div>
            </div>

            <div className="md:grid md:grid-cols-12 md:gap-6 items-center">
              {/* Image */}
              <div
                className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-5 lg:col-span-6 mb-8 md:mb-0 md:order-1"
                data-aos="fade-up"
              >
                <Image
                  className="max-w-full mx-auto md:max-w-none h-auto"
                  src={featureManageImage}
                  quality={100}
                  priority
                  alt="Manage PBM payments"
                />
              </div>
              {/* Content */}
              <div
                className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-7 lg:col-span-6"
                data-aos="fade-right"
              >
                <div className="md:pr-4 lg:pr-12 xl:pr-16">
                  <h3 className="h3 mb-3">Review and manage PBM payments</h3>
                  <p className="text-normal md:text-lg text-gray-400 mb-4">
                    As a payer, you can review, sort, and filter all your PBM
                    payments. If needed and a payment is still within the
                    specified holding duration, you can even exercise your power
                    to recall it! You can also delve deep into your payment
                    transactions on the blockchain with the transaction IDs.
                  </p>
                </div>
              </div>
            </div>

            <div className="md:grid md:grid-cols-12 md:gap-6 items-center">
              {/* Image */}
              <div
                className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-5 lg:col-span-6 mb-8 md:mb-0 rtl"
                data-aos="fade-up"
              >
                <Image
                  className="max-w-full mx-auto md:max-w-none h-auto"
                  src={featureDisbursementImage}
                  quality={100}
                  priority
                  alt="Automatic disbursement of PBM payments"
                />
              </div>
              {/* Content */}
              <div
                className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-7 lg:col-span-6"
                data-aos="fade-left"
              >
                <div className="md:pl-4 lg:pl-12 xl:pl-16">
                  <h3 className="h3 mb-3">
                    Automatic disbursement of PBM payments
                  </h3>
                  <p className="text-normal md:text-lg text-gray-400 mb-4">
                    Once the holding period is over, the protocol ensures that
                    the escrow PBM tokens are automatically and trustlessly
                    released into the recipients’ wallets, ready for them to
                    unwrap and utilise the monies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
