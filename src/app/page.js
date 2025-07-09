export const dynamic = "force-dynamic";
import {
  Calendar,
  Clock,
  TrendingUp,
  Users,
  Award,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LotteryBalls from "@/components/LotteryBalls";
import { getLunchtimeApiCall, getTeatimeApiCall } from "@/lib/apis";
import { number } from "zod";
import { formatResult, getHotColdOverdueNumbers, parseDMYtoDate, parseDrawDate } from "@/utils/functions";

// ✅ DYNAMIC METADATA FUNCTION

export async function generateMetadata() {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}metadata/get-metadata/home`;
  const verifyUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}verification-code/get`;

  const response = await fetch(url, { cache: "no-store" });
  const result = await response.json();

  const verifyRes = await fetch(verifyUrl, { cache: "no-store" });
  const verifyResult = await verifyRes.json();
  const verificationCode = verifyResult?.googleVerificationCode;

  let data = null;

  data = result?.data;

  return {
    title: data?.title || "Home",
    description: data?.description || "Home",
    keywords: data?.keywords || ["Home"],
    openGraph: {
      title: data?.ogTitle || "Home",
      description: data?.ogDescription || "Home",
      url: process.env.NEXT_PUBLIC_BASEURL,
      type: "website",
      images: [
        {
          url:
            data?.ogImage || "https://lovable.dev/opengraph-image-p98pqg.png",
          secureUrl:
            data?.ogImage || "https://lovable.dev/opengraph-image-p98pqg.png",
          width: 1200,
          height: 630,
          alt: data?.ogImageAlt || "Home",
        },
      ],
      site_name: process.env.NEXT_PUBLIC_SITENAME || "home",
    },
    alternates: {
      canonical: data?.canonical || process.env.NEXT_PUBLIC_BASEURL,
    },
    other: {
      "google-site-verification": verificationCode || "CODE_MISSING",
    },
  };
}

export default async function Home() {
  const lunchData = await getLunchtimeApiCall();
  const teaData = await getTeatimeApiCall();



const lunchFormatted = lunchData[0] ? formatResult(lunchData[0], "Lunchtime") : null;
const teaFormatted = teaData[0] ? formatResult(teaData[0], "Teatime") : null;

const latestResults = {
  lunchtime: lunchFormatted,
  teatime:
    teaFormatted &&
    lunchFormatted &&
    parseDMYtoDate(teaFormatted.date) >= parseDMYtoDate(lunchFormatted.date)
      ? teaFormatted
      : "Waiting For Results",
};


const allResults = [...lunchData, ...teaData]; // Combine both
const sortedResults = allResults.sort((a, b) => {
  const dateA = parseDrawDate(a.d_date);
  const dateB = parseDrawDate(b.d_date);
  return dateB - dateA; // Newest first
});


  const { hotNumbers, coldNumbers, overdueNumbers } = getHotColdOverdueNumbers(sortedResults);


  return (
    <>
      <Header />
      <section className="py-8 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
              Latest UK49&apos;s Results
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Here player can see the latest results of uk 49s lottery draw.
              Each draw numbers are 100% verfied from the official results. Get
              more information scroll the page below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            {/* Lunchtime Draw */}
            <div className="card-gradient-blue rounded-xl p-4 sm:p-8 border-2 border-blue-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2 sm:gap-4">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Lunchtime Results
                </h3>



                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm font-medium">
                      {latestResults?.lunchtime ?  latestResults?.lunchtime.date : null}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">
                      {latestResults.lunchtime ? latestResults.lunchtime.time : null}
                    </span>
                  </div>
                </div>
              </div>
              {/* <div className="flex justify-center mb-4 sm:mb-6">
                <LotteryBalls
                  numbers={latestResults.lunchtime.numbers}
                  boosterBall={latestResults.lunchtime.boosterBall}
                  size="medium"
                  mobileLayout={true}
                />
              </div>
 */}


{ latestResults.lunchtime ? (
              <div className="flex justify-center mb-4 sm:mb-6">
<LotteryBalls
                  numbers={latestResults.lunchtime.numbers}
                  boosterBall={latestResults.lunchtime.boosterBall}
                  size="medium"
                  mobileLayout={true}
                />
                              </div>
                ) : (
                  <div className="flex justify-center items-center text-gray-600 text-base sm:text-2xl font-semibold">
"loading..."
                  </div>
                )}


              <Link
                href="/results"
                className="block text-center bg-blue-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                View Full Results
              </Link>
            </div>

            {/* Teatime Draw */}
            <div className="card-gradient-purple rounded-xl p-4 sm:p-8 border-2 border-purple-100 flex flex-col justify-between ">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2 sm:gap-4">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Teatime Results
                </h3>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm font-medium">
                      {latestResults.teatime.date}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">
                      {latestResults.teatime.time}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-grow justify-center mb-4 sm:mb-6">
                {typeof latestResults.teatime === "object" ? (
                  <LotteryBalls
                    numbers={latestResults.teatime.numbers}
                    boosterBall={latestResults.teatime.boosterBall}
                    size="medium"
                    mobileLayout={true}
                  />
                ) : (
                  <div className="flex justify-center items-center text-gray-600 text-base sm:text-2xl font-semibold">
                    {latestResults.teatime}
                  </div>
                )}
              </div>
              <Link
                href="/results"
                className="block text-center bg-purple-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-sm sm:text-base"
              >
                View Full Results
              </Link>
            </div>
          </div>

          {/* Get Prediction Button - Outside of the draws */}
          <div className="flex justify-center mt-6 sm:mt-8">
            <Link
              href="/history"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm sm:text-base"
            >
              View & Export History Results
            </Link>
          </div>

          <div className="text-center mt-6">
            <p className="text-lg sm:text-xl text-gray-600">
              For useful tips, you can check the{" "}
              <Link
                href="/predictions"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                next draw predictions
              </Link>{" "}
              by Albertisto. They are completely free and updated before each
              draw. These predictions are based on recent results to help you
              make better number choices.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              49&apos;s Results Number Analysis
            </h2>
            <p className="text-xl text-gray-600">
              It shows a simple number analysis based on the last 30 49s draws.
              The goal is to help players understand which numbers appear more
              often and which ones do not. This information may help you make
              better number choices for future games.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Hot Numbers */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <TrendingUp className="h-8 w-8 text-red-500 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Hot Numbers
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Most frequently drawn numbers in the last 30 days
              </p>
              <div className="flex justify-center mb-6">
                <LotteryBalls numbers={hotNumbers} />
              </div>
              <Link
                href="/hot-balls"
                className="block text-center bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                View Hot Balls
              </Link>
            </div>

            {/* Cold Numbers */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <TrendingDown className="h-8 w-8 text-blue-500 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Cold Numbers
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Least frequently drawn numbers in the last 30 days
              </p>
              <div className="flex justify-center mb-6">
                <LotteryBalls numbers={coldNumbers} />
              </div>
              <Link
                href="/cold-balls"
                className="block text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                View Cold Balls
              </Link>
            </div>

            {/* Overdue Numbers */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <Clock className="h-8 w-8 text-purple-500 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Overdue Numbers
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Numbers that haven&apos;t appeared recently in the last 30 days
              </p>
              <div className="flex justify-center mb-6">
                <LotteryBalls numbers={overdueNumbers} />
              </div>
              <Link
                href="/overdue-balls"
                className="block text-center bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                View Overdue Balls
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Best Strategies for Choosing UK49s Numbers
            </h2>
            <div className="max-w-4xl mx-auto text-lg text-gray-600 leading-relaxed space-y-4">
              <p>
                Choosing winning numbers for UK lottery requires a strategic
                approach that combines statistical analysis with smart number
                selection techniques. While lottery draws are random,
                understanding patterns and trends can help improve your number
                selection strategy.
              </p>

              <p>
                <strong>Hot and Cold Number Analysis:</strong> Study the
                frequency of numbers drawn over the past 30-50 draws. Hot
                numbers appear frequently and might continue their streak, while
                cold numbers haven&apos;t appeared recently and may be due for
                selection. Balance your picks between both categories to
                maximize coverage.
              </p>

              <p>
                <strong>Overdue Number Strategy:</strong> Numbers that
                haven&apos;t appeared for extended periods statistically have
                higher chances of being drawn. Monitor overdue balls and
                consider including 1-2 in your selection, but don&apos;t rely
                solely on this method.
              </p>

              <p>
                <strong>Number Range Distribution:</strong> Spread your numbers
                across the entire range (1-49). Avoid clustering all picks in
                low (1-16), mid (17-33), or high (34-49) ranges. A balanced
                distribution typically includes numbers from each range.
              </p>

              <p>
                <strong>Avoid Common Patterns:</strong> Many players choose
                birthdays (limiting to 1-31), consecutive numbers, or geometric
                patterns on play slips.These methods reduce number variety and
                may lead to more people choosing the same set, which lowers your
                chances of win.
              </p>

              <p>
                <strong>Statistical Combinations:</strong> Consider using a mix
                of even and odd numbers (3:3 or 4:2 ratio works well), and
                combine high-frequency numbers with some less common picks.
                Remember, each draw is independent, but historical data can
                guide informed decisions for better long-term results.
              </p>
              <p>
                We aim to provide all the information you need. If you still
                have questions or feel unsure, please read{" "}
                <Link
                  href="/faq"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Frequently Asked Questions (FAQ)
                </Link>{" "}
                for more help.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Latest Insights
              </h3>
              <p className="text-gray-600">
                Stay updated with expert tips, number trends, and game
                strategies on our{" "}
                <Link
                  href="/guide"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  blog section
                </Link>
                . We share helpful posts to guide UK 49 players.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Learn the Rules
              </h3>
              <p className="text-gray-600">
                Want to understand the game better? Visit our{" "}
                <Link
                  href="/guide"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  playing guide
                </Link>{" "}
                to learn about number selection, draws, and winning chances.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Community Trusted
              </h3>
              <p className="text-gray-600">
                Join thousands of lottery players who use our platform to stay
                informed with stats like hot and cold numbers, overdue balls,
                and more, visit our{" "}
                <Link
                  href="/statistics"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  statistics page
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
