import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Gift,
  Lightning,
  NotePencil,
  Percent,
  Shield,
  Star,
  TrendUp,
  Users,
  X,
} from "@phosphor-icons/react";
import { PiCertificateFill, PiCakeFill, PiHandCoinsFill, PiStarFill, PiCrownSimple } from "react-icons/pi";
import { OutlineButton, PrimaryButton } from "sprint-asia-custom-component";
import { useDisclosure } from "prezent/useDisclosure";
import LogoPatrict from "../../../assets/images/logo_patrict.png";
import LogoBronze from "../../../assets/Badge_04.png";
import LogoSilver from "../../../assets/Badge_5.png";
import LogoGold from "../../../assets/Badge_6.png";
import LogoPlatinum from "../../../assets/Badge_8.png";
import Stepper from "../../../components/Stepper";
import { CreateTierLevelFormData } from "../../../service/TieringManagement/endpoint/tieringLevel";
import LoadingModal from "prezent/LoadingModal";
import ResultModal from "prezent/ResultModal";

const OnBoardingTieringLevel = ({ roleAccess, setTitleHeader, loyaltyId, navigateToDashboard }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentSelectedTierProgram, setCurrentSelectedTierProgram] = useState(0);
  const navigate = useNavigate();
  const { isOpen: isLoading, open: openLoading, close: closeLoading } = useDisclosure(false);
  const { isOpen: resultModalIsOpen, open: openResultModal, close: closeResultModal } = useDisclosure(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");

  const handleOpenModalResult = (type, subtitle) => {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      openResultModal();
      setTimeout(() => {
        closeResultModal();
      }, 1000);
    }, 250);
  };

  function handleBackTierLevel() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  function handleNextTierLevel() {
    if (currentStep === 4) {
      handleSubmitTierLevelOnBoarding();
    } else {
      setCurrentStep(currentStep + 1);
    }
  }

  function handleNavigateToDashboardTieringLevel() {
    navigateToDashboard();
  }

  const appendFormData = (formData, data, parentKey = "") => {
    if (data === null || data === undefined) return;

    if (typeof data === "object" && !(data instanceof File)) {
      Object.keys(data).forEach((key) => {
        const value = data[key];
        const newKey = parentKey ? (Array.isArray(data) ? `${parentKey}[${key}]` : `${parentKey}.${key}`) : key;
        appendFormData(formData, value, newKey);
      });
    } else {
      formData.append(parentKey, data);
    }
  };

  async function handleSubmitTierLevelOnBoarding() {
    try {
      openLoading();
      const formData = new FormData();
      if (currentSelectedTierProgram === 1) {
        const payload = {
          downgradeEnabled: true,
          isTemplate: true,
          evaluationPeriod: 4,
          templateType: "simple",
          tiers: [
            {
              name: "Member",
              status: "Active",
              level: 1,
              progressionType: "Spend OR Frequency",
              minSpend: 0,
              minTransactions: 0,
              icon: "tier-level-4.png",
              benefits: [
                {
                  type: "Points Multiplier",
                  value: "1",
                  title: "Basic point earning",
                  description: "Earn 1 point for every Rp 10,000 spent",
                  level: 1,
                  unit: "x",
                },
              ],
            },
            {
              name: "VIP",
              status: "Active",
              level: 2,
              progressionType: "Spend OR Frequency",
              minSpend: 2500000,
              minTransactions: 10,
              icon: "tier-level-6.png",
              benefits: [
                {
                  type: "Points Multiplier",
                  value: "2",
                  title: "Enhanced Points",
                  description: "Earn 2x points for every purchase",
                  level: 1,
                  unit: "x",
                },
                {
                  type: "Percentage Discount",
                  value: "10",
                  title: "VIP Discount",
                  description: "Get 10% Discount on all purchases",
                  level: 2,
                  unit: "%",
                },
              ],
            },
          ],
        };
        appendFormData(formData, payload);
      } else if (currentSelectedTierProgram === 2) {
        const payload = {
          downgradeEnabled: true,
          isTemplate: true,
          evaluationPeriod: 4,
          templateType: "advance",
          tiers: [
            {
              name: "Bronze",
              status: "Active",
              level: 1,
              progressionType: "Spend OR Frequency",
              minSpend: 0,
              minTransactions: 0,
              icon: "tier-level-4.png",
              benefits: [
                {
                  type: "Points Multiplier",
                  value: "1",
                  title: "Basic point earning",
                  description: "Earn 1 point for every Rp 10,000 spent",
                  level: 1,
                  unit: "x",
                },
              ],
            },
            {
              name: "Silver",
              status: "Active",
              level: 2,
              progressionType: "Spend OR Frequency",
              minSpend: 1500000,
              minTransactions: 8,
              icon: "tier-level-5.png",
              benefits: [
                {
                  type: "Points Multiplier",
                  value: "1.5",
                  title: "Enhanced Points",
                  description: "Earn 1.5x points for every purchase",
                  level: 1,
                  unit: "x",
                },
              ],
            },
            {
              name: "Gold",
              status: "Active",
              level: 3,
              progressionType: "Spend OR Frequency",
              minSpend: 5000000,
              minTransactions: 20,
              icon: "tier-level-6.png",
              benefits: [
                {
                  type: "Points Multiplier",
                  value: "1.5",
                  title: "Premium Points",
                  description: "Earn 2x points for every purchase",
                  level: 1,
                  unit: "x",
                },
                {
                  type: "Percentage Discount",
                  value: "5",
                  title: "Member Discount",
                  description: "Get 5% Discount on all purchases",
                  level: 2,
                  unit: "%",
                },
              ],
            },
            {
              name: "Platinum",
              status: "Active",
              level: 4,
              progressionType: "Spend OR Frequency",
              minSpend: 12000000,
              minTransactions: 35,
              icon: "tier-level-7.png",
              benefits: [
                {
                  type: "Points Multiplier",
                  value: "3",
                  title: "Platinum Points",
                  description: "Earn 3x points for every purchase",
                  level: 1,
                  unit: "x",
                },
                {
                  type: "Percentage Discount",
                  value: "10",
                  title: "VIP Discount",
                  description: "Get 10% Discount on all purchases",
                  level: 2,
                  unit: "%",
                },
                {
                  type: "Priority Support",
                  value: "0",
                  title: "Dedicated Support",
                  description: "24/7 priority customer support",
                  level: 3,
                  unit: "0",
                },
              ],
            },
          ],
        };
        appendFormData(formData, payload);
      } else {
        const payload = {
          downgradeEnabled: false,
          isTemplate: false,
          evaluationPeriod: 12,
          templateType: "custom",
        };
        appendFormData(formData, payload);
      }
      await CreateTierLevelFormData(loyaltyId, formData);
      handleNavigateToDashboardTieringLevel();
      closeLoading();
    } catch (error) {
      handleOpenModalResult("failed", "Sorry, unable to add tier level at the moment. Please try again");
      closeLoading();
    }
  }

  useEffect(() => {
    setTitleHeader("Tier Level");
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-neutral20 py-6 px-8 items-center">
      <div className="flex justify-center mb-4">
        <Stepper data={["Welcome", "Concept", "Benefits", "Template"]} currentStep={currentStep - 1} />
      </div>
      <div className="bg-white rounded-lg shadow-md">
        <div>
          {currentStep === 1 && (
            <>
              <div className="flex justify-center w-full pt-8">
                <img src={LogoPatrict} />
              </div>
              <p className="text-center font-semibold text-3xl">Welcome to Tier Level Management!</p>
              <div className="flex justify-center w-full">
                <p className="text-center text-lg px-24 py-4">
                  Let’s set up your loyalty tier system to deliver the best experience for your customers. This system
                  helps you automatically group customers based on loyalty levels and unlock rewards that match their
                  journey.
                </p>
              </div>
              <div className="flex items-center justify-center px-4 pb-8">
                <div className="border p-8 text-center mx-4 rounded-lg border-neutral40">
                  <div className="flex justify-center w-full">
                    <Users size={36} className="text-primary500" />
                  </div>
                  <p className="font-semibold py-2 text-xl">Automatic Placement</p>
                  <p>Customers are automatically assigned to the right tier based on their activity.</p>
                </div>
                <div className="border p-8 text-center mx-4 rounded-lg border-neutral40">
                  <div className="flex justify-center w-full">
                    <Gift size={36} className="text-secondary600" />
                  </div>
                  <p className="font-semibold py-2 text-xl">Smart Benefits</p>
                  <p>Offer tailored and attractive benefits based on each customer’s tier.</p>
                </div>
                <div className="border p-8 text-center mx-4 rounded-lg border-neutral40">
                  <div className="flex justify-center w-full">
                    <TrendUp size={36} className="text-primary500" />
                  </div>
                  <p className="font-semibold py-2 text-xl">Growth Oriented</p>
                  <p>Motivate customers to move up the tier ladder with better perks.</p>
                </div>
              </div>
            </>
          )}
          {currentStep === 2 && (
            <div className="pt-8">
              <p className="text-center font-semibold text-2xl">How Does the Tier System Work?</p>
              <div className="flex justify-center w-full">
                <p className="text-center text-lg px-24 pt-2 pb-4">
                  Customers will automatically move up tiers based on their activity. The higher the tier, the more
                  attractive the benefits.
                </p>
              </div>
              <div className="flex items-center justify-between text-center px-24">
                <div className="p-4 border border-neutral40 rounded-lg w-64">
                  <div className="w-full justify-center flex">
                    <img src={LogoBronze} className="w-20" />
                  </div>
                  <p className="text-center font-semibold text-lg">Bronze</p>
                  <p className="py-1 text-neutral500">Default tier for all new customers</p>
                  <p className="p-1 bg-primary50 rounded-full text-sm font-semibold text-primary500">
                    Rp 0 · 0 transactions
                  </p>
                </div>
                <ArrowRight size={24} />
                <div className="p-4 border border-neutral40 rounded-lg w-64">
                  <div className="w-full justify-center flex">
                    <img src={LogoSilver} className="w-20" />
                  </div>
                  <p className="text-center font-semibold text-lg">Silver</p>
                  <p className="py-1 text-neutral500">Customers starting to show loyalty</p>
                  <p className="p-1 bg-primary50 rounded-full text-sm font-semibold text-primary500">
                    Rp 1.5M · 8 transactions
                  </p>
                </div>
                <ArrowRight size={24} />
                <div className="p-4 border border-neutral40 rounded-lg w-64">
                  <div className="w-full justify-center flex">
                    <img src={LogoGold} className="w-20" />
                  </div>
                  <p className="text-center font-semibold text-lg">Gold</p>
                  <p className="py-1 text-neutral500">Premium customers with the best benefits</p>
                  <p className="p-1 bg-primary50 rounded-full text-sm font-semibold text-primary500">
                    Rp 5M · 20 transactions
                  </p>
                </div>
              </div>
              <div className="flex justify-center px-12 my-8">
                <div className="w-full border rounded-lg border-neutral40 mx-4 px-4">
                  <div className="flex items-center py-2 mb-2">
                    <Lightning className="text-primary500" size={24} />
                    <p className="px-2 font-semibold text-lg">Automatic Tier Upgrade</p>
                  </div>
                  <div className="flex items-center py-2">
                    <Check />
                    <p className="px-2">Auto-upgrade after successful transactions</p>
                  </div>
                  <div className="flex items-center py-2">
                    <Check />
                    <p className="px-2">Rolling window evaluation (30/90 days)</p>
                  </div>
                </div>
                <div className="w-full border rounded-lg border-neutral40 mx-4 px-4">
                  <div className="flex items-center py-2 mb-2">
                    <Shield className="text-secondary600" size={24} />
                    <p className="px-2 font-semibold text-lg">Smart Protection</p>
                  </div>
                  <div className="flex items-center py-2">
                    <Check />
                    <p className="px-2">Default tier for all customers</p>
                  </div>
                  <div className="flex items-center py-2">
                    <Check />
                    <p className="px-2">Auto-downgrade for inactive customers</p>
                  </div>
                  <div className="flex items-center py-2">
                    <Check />
                    <p className="px-2">Supports campaign integration</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {currentStep === 3 && (
            <div className="pt-8">
              <p className="text-center font-semibold text-2xl">Types of Benefits You Can Offer</p>
              <div className="flex justify-center w-full">
                <p className="text-center text-lg px-24 pt-2 pb-4">
                  Select attractive benefits for each tier level. The higher the tier, the more exciting the benefits
                  you can offer.
                </p>
              </div>
              <div className="flex items-center justify-between text-center px-16">
                <div className="w-full text-center border border-neutral40 rounded-lg p-4 m-2">
                  <div className="flex justify-center mb-2">
                    <Percent size={32} className="text-white bg-primary500 rounded-md" />
                  </div>
                  <p className="font-semibold py-1">Percentage Discount</p>
                  <p>Offer percentage off on purchases</p>
                </div>
                <div className="w-full text-center border border-neutral40 rounded-lg p-4 m-2">
                  <div className="flex justify-center mb-2">
                    <X size={32} className="text-white bg-primary300 rounded-md" />
                  </div>
                  <p className="font-semibold py-1">Points Multiplier</p>
                  <p>Multiply earning points rate</p>
                </div>
                <div className="w-full text-center border border-neutral40 rounded-lg p-4 m-2">
                  <div className="flex justify-center mb-2">
                    <PiCertificateFill size={32} className="text-primary500" />
                  </div>
                  <p className="font-semibold py-1">Priority Support</p>
                  <p>Fast-track customer service</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-center px-16">
                <div className="w-full text-center border border-neutral40 rounded-lg p-4 m-2">
                  <div className="flex justify-center mb-2">
                    <PiHandCoinsFill size={32} className="text-success500" />
                  </div>
                  <p className="font-semibold py-1">Cashback Rewards</p>
                  <p>Return money on purchases</p>
                </div>
                <div className="w-full text-center border border-neutral40 rounded-lg p-4 m-2">
                  <div className="flex justify-center mb-2">
                    <PiCakeFill size={32} className="text-danger500" />
                  </div>
                  <p className="font-semibold py-1">Birthday Bonus</p>
                  <p>Special birthday rewards</p>
                </div>
                <div className="w-full text-center border border-neutral40 rounded-lg p-4 m-2">
                  <div className="flex justify-center mb-2">
                    <PiStarFill size={32} className="text-warning500" />
                  </div>
                  <p className="font-semibold py-1">Custom Benefit</p>
                  <p>Create your own benefit</p>
                </div>
              </div>
              <div className="mx-16 border border-neutral40 bg-neutral20 rounded-lg py-4 px-8 mt-4 mb-8">
                <p className="font-semibold text-lg">Example of Benefit Structure</p>
                <div className="flex justify-between px-4">
                  <div className="w-full mx-8 mt-2">
                    <div className="flex justify-center mb-2">
                      <img src={LogoBronze} className="w-16" />
                    </div>
                    <p className="font-semibold py-1 text-center">Bronze Tier</p>
                    <ul className="px-4 list-disc text-neutral500">
                      <li>1x Points earning</li>
                      <li>Basic support</li>
                    </ul>
                  </div>
                  <div className="w-full mx-8 mt-2">
                    <div className="flex justify-center mb-2">
                      <img src={LogoSilver} className="w-16" />
                    </div>
                    <p className="font-semibold py-1 text-center">Silver Tier</p>
                    <ul className="px-4 list-disc text-neutral500">
                      <li>1.5x Points earning</li>
                      <li>5% Discount</li>
                      <li>Priority queue</li>
                    </ul>
                  </div>
                  <div className="w-full mx-8 mt-2">
                    <div className="flex justify-center mb-2">
                      <img src={LogoGold} className="w-16" />
                    </div>
                    <p className="font-semibold py-1 text-center">Gold Tier</p>
                    <ul className="px-4 list-disc text-neutral500">
                      <li>2x Points earning</li>
                      <li>10% Discount</li>
                      <li>24/7 Support</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          {currentStep === 4 && (
            <div className="pt-8">
              <p className="text-center font-semibold text-2xl">Choose a Template to Get Started</p>
              <div className="flex justify-center w-full">
                <p className="text-center text-lg px-24 pt-2 pb-4">
                  Select a template that matches your business needs. You can customize it later after setup is
                  complete.
                </p>
              </div>
              <div className="flex justify-between px-16">
                <div
                  className={`flex-col flex w-full border border-neutral40 ${
                    currentSelectedTierProgram === 1 ? "bg-primary50" : ""
                  } rounded-lg py-4 px-8 m-2`}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-lg">Simple (2 Tiers)</p>
                      <p className="p-1 bg-neutral40 text-neutral500 rounded-full px-4">Recommended</p>
                    </div>
                    <p className="text-md text-neutral80 mt-4">
                      Perfect for businesses just starting a loyalty program. Focuses on differentiating basic vs. VIP
                      customers.
                    </p>
                    <div className="flex items-center py-2">
                      <img src={LogoBronze} className="w-16 mr-4" />
                      <div>
                        <p className="font-semibold">Member</p>
                        <p className="mr-2">Default tier · 1x points</p>
                      </div>
                    </div>
                    <div className="flex items-center py-2">
                      <img src={LogoGold} className="w-16 mr-4" />
                      <div>
                        <p className="font-semibold">VIP</p>
                        <p className="mr-2">Rp 2.5M · 2x points · 10% discount</p>
                      </div>
                    </div>
                  </div>
                  {currentSelectedTierProgram === 1 ? (
                    <PrimaryButton
                      title="Use Simple Template"
                      onClick={() => setCurrentSelectedTierProgram(1)}
                      type="full"
                    />
                  ) : (
                    <OutlineButton
                      title="Use Simple Template"
                      onClick={() => setCurrentSelectedTierProgram(1)}
                      type="full"
                    />
                  )}
                </div>
                <div
                  className={`flex-col flex w-full border border-neutral40 ${
                    currentSelectedTierProgram === 2 ? "bg-primary50" : ""
                  } rounded-lg py-4 px-8 m-2`}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-lg">Advanced (4 Tiers)</p>
                    </div>
                    <p className="text-md text-neutral80 mt-4">
                      For businesses that want a more detailed tier structure with various attractive benefits.
                    </p>
                    <div className="flex items-center py-2">
                      <img src={LogoBronze} className="w-16 mr-4" />
                      <div>
                        <p className="font-semibold">Bronze</p>
                        <p className="mr-2">Default tier</p>
                      </div>
                    </div>
                    <div className="flex items-center py-2">
                      <img src={LogoSilver} className="w-16 mr-4" />
                      <div>
                        <p className="font-semibold">Silver</p>
                        <p className="mr-2">Rp 1.5M · 5% discount</p>
                      </div>
                    </div>
                    <div className="flex items-center py-2">
                      <img src={LogoSilver} className="w-16 mr-4" />
                      <div>
                        <p className="font-semibold">Gold</p>
                        <p className="mr-2">Rp 5M · 10% + free shipping</p>
                      </div>
                    </div>
                    <div className="flex items-center py-2">
                      <img src={LogoPlatinum} className="w-16 mr-4" />
                      <div>
                        <p className="font-semibold">Platinum</p>
                        <p className="mr-2">Rp 12M · 15% + premium support</p>
                      </div>
                    </div>
                  </div>
                  {currentSelectedTierProgram === 2 ? (
                    <PrimaryButton
                      title="Use Advanced Template"
                      onClick={() => setCurrentSelectedTierProgram(2)}
                      type="full"
                    />
                  ) : (
                    <OutlineButton
                      title="Use Advanced Template"
                      onClick={() => setCurrentSelectedTierProgram(2)}
                      type="full"
                    />
                  )}
                </div>
              </div>
              <div className="border border-neutral40 bg-neutral20 rounded-lg py-4 px-8 my-4 mx-36">
                <p className="text-center">Want to create your own custom tier structure from scratch?</p>
                <div className="flex justify-center mt-2">
                  <OutlineButton
                    title={
                      <div className="text-primary500 flex items-center">
                        <PiCrownSimple />
                        <p className="ml-2">Create Custom Structure</p>
                      </div>
                    }
                    onClick={() => setCurrentSelectedTierProgram(3)}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center justfy-between p-4 bg-neutral30">
            {currentStep > 1 && (
              <OutlineButton
                size="small"
                title={
                  <div className="flex items-center gap-2">
                    <ArrowLeft />
                    <p>Back</p>
                  </div>
                }
                onClick={() => {
                  handleBackTierLevel();
                }}
              />
            )}
            <p className="w-full text-center text-neutral500">Step {currentStep} of 4</p>
            <PrimaryButton
              size="small"
              title={
                <div className="flex items-center gap-2">
                  <p>Next</p>
                  <ArrowRight />
                </div>
              }
              onClick={() => {
                handleNextTierLevel();
              }}
            />
          </div>
        </div>
      </div>
      <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={resultModalIsOpen} onClose={() => {}} />
      <LoadingModal title="Loading..." subtitle="Please wait a moment" isOpen={isLoading} onClose={() => {}} />
    </div>
  );
};

export default OnBoardingTieringLevel;
