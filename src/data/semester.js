import { ChevronDown, ChevronRight, BookOpen, FileText, Download } from "lucide-react";

const semesterData = {
  s1: {
    name: "Semester 1",
    subjects: [
      {
        id: "adv_calc",
        name: "Advanced Calculus",
        image:
          "https://github.com/Shubhajeetgithub/photos/blob/main/AC.png?raw=true",
        resources: [
          {
            name: "Tutorials",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EvbzH0FixhpBr03NaVuVQ-AB7VCUx_FurLcTppmwP2fBEA?e=bwTCWE",
            icon: FileText,
          },
          { name: "Lecture Notes", url: "#", icon: BookOpen },
        ],
      },
      {
        id: "pow",
        name: "Physics of Waves",
        image:
          "https://github.com/Shubhajeetgithub/photos/blob/main/PoW.png?raw=true",
        resources: [
          {
            name: "Short Notes",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EuuxkMtVi_RNitLAdo20fm4BVFuGr1Adzp7HuUt7tzu_8g?e=BvmJqQ",
            icon: FileText,
          },
        ],
      },
    ],
  },
  s2: {
    name: "Semester 2",
    subjects: [
      {
        id: "ec",
        name: "Basic Electronics",
        image:
          "https://github.com/Shubhajeetgithub/photos/blob/main/EC.png?raw=true",
        resources: [
          {
            name: "PYQ",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EpE5jV5PpFpLuB4mMUNUVoMBfAhzZSDM2I_NwmQ6qkroaA?e=MMtBaS",
            icon: FileText,
          },
          {
            name: "Tutorials",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EgBJVzn60P1DkTkUDRNud04BbFF9PsQ9-3BwsoCx7bMMyQ?e=sE18km",
            icon: BookOpen,
          },
          {
            name: "Short Notes",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/Euois0-DdqNEvWAyXU_4K8sBjwh4j1zZEqRog8VUUkgCIA?e=jcWAQM",
            icon: FileText,
          },
          {
            name: "Newman Solutions",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EgC4FH3xqutJiYT5z14wwT4Bsn1WsRgVhMw7ekG-ny84Lg?e=vsIaDn",
            icon: Download,
          },
        ],
      },
      {
        id: "et",
        name: "Electrical Technology",
        image:
          "https://github.com/Shubhajeetgithub/photos/blob/main/ET.png?raw=true",
        resources: [
          {
            name: "PYQ",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EiSz1ua6s61KvejosjYX-_kBqL-4-iTRRr9v3KuxdXH39w?e=lIWocb",
            icon: FileText,
          },
          {
            name: "Tutorials",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EtBYYaYl_mdEgiaHCaE_La4B6i8BNnCgvDKeWnWVD_hMYA?e=eVO1qC",
            icon: BookOpen,
          },
          {
            name: "Short Notes",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EuQJJsrCeEVMh3_VgrPZDzYBhjGSFSJKlP-M-XBDAFFJ5w?e=02lpXY",
            icon: FileText,
          },
        ],
      },
      {
        id: "intro_ds",
        name: "Introduction to Data Science",
        image:
          "https://github.com/Shubhajeetgithub/photos/blob/main/IntroDS.png?raw=true",
        resources: [
          {
            name: "Slides",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EmAkIucSyehNq1dqngHn-CcBWBDwCRK8JDvoO_iNB7wDQg?e=fPpUaX",
            icon: FileText,
          },
        ],
      },
      {
        id: "SPL",
        name: "System Programming Lab",
        image:
          "https://github.com/Shubhajeetgithub/photos/blob/main/spl.png?raw=true",
        resources: [
          {
            name: "Slides",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EnDXss39wPVEhjtst3kH4LoBdueRvppWXnA-gSHTS6goIA?e=H3MwN5",
            icon: FileText,
          },
          {
            name: "Assignments",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/Ei6_7VFJ49ZJr5GoamcvhwYBAlQ2Y83IoqxgnzKnZTOsuQ?e=q3JzDT",
            icon: Download,
          },
        ],
      },
      {
        id: "lanca",
        name: "Linear Algebra, Numerical and Complex Analysis",
        image:
          "https://github.com/Shubhajeetgithub/photos/blob/main/LinearAlgebra.png?raw=true",
        resources: [
          {
            name: "PYQ",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EqEbDaujfcFKn5Kt9xb4DIgBdwJhMuoZ6b-OZ-vEzTT2NQ?e=yLlwGf",
            icon: FileText,
          },
          {
            name: "Tutorials",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EgzGGEkVM11GplRAAgcyJJYBrsqYlt2tR6k3-TpxfcvoXA",
            icon: BookOpen,
          },
        ],
      },
    ],
  },
  s3: {
    name: "Semester 3",
    subjects: [
      {
        id: "ai",
        name: "Intoduction to Artificial Intelligence",
        image:
          "https://github.com/Shubhajeetgithub/photos/blob/main/EC.png?raw=true",
        resources: [
          {
            name: "Syllabus",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/ErO-fKkIXaZGjxydrtzEcs8BFsgm1ki1SoaVXgypca_TJw?e=VLZdwr",
            icon: FileText,
          },
        ],
      },
      {
        id: "ml",
        name: "Introduction to Machine Learning",
        image:
          "https://github.com/Shubhajeetgithub/photos/blob/main/ET.png?raw=true",
        resources: [
          {
            name: "Syllabus",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EunGyN-55G1Ml6AVHifLPGgB8b7wJG809UPDP1BUhjnPSQ?e=pnnouu",
            icon: FileText,
          },
        ],
      },
      {
        id: "linalgAi",
        name: "Linear Algebra for AI",
        image:
          "https://github.com/Shubhajeetgithub/photos/blob/main/IntroDS.png?raw=true",
        resources: [
          {
            name: "Syllabus",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EiJBmDFxyaxCkA5bK-xVmP4B5DoFiAgH7HHane22SGgFPw?e=cbKo7E",
            icon: FileText,
          },
        ],
      },
      {
        id: "algo",
        name: "Design and analysis of Algorithms",
        image:
          "https://github.com/Shubhajeetgithub/photos/blob/main/spl.png?raw=true",
        resources: [
          {
            name: "Syllabus",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/Eh1WzMAfjJtAkV_xoa7frjwBchYlafoaTBZvXqydZsy5nw?e=TwhChh",
            icon: FileText,
          },
        ],
      },
      {
        id: "prob",
        name: "Probability and Statistics",
        image:
          "https://github.com/Shubhajeetgithub/photos/blob/main/spl.png?raw=true",
        resources: [
          {
            name: "Syllabus",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/En0A9mwowmFHn-Gu2KwcqosBQd1B9eQNZ2dBanHDdRGWjg?e=aWSM8L",
            icon: FileText,
          },
        ],
      },
    ],
  },
};

export { semesterData };
