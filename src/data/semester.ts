import { BookOpen, FileText, Download } from "lucide-react";

const semesterData = {
  s1: {
    name: "Semester 1",
    subjects: [
      {
        id: "adv_calc",
        name: "Advanced Calculus",
        image:
          "/photos/AC.png",
        resources: [
          {
            name: "Tutorials",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/durvadaga_24_kgpian_iitkgp_ac_in/EmNgaK7lcAVMoYJ47Ig1WjQBiQ5NEuq0F5_pkb8SWGAlxw?e=uwC2vz",
            icon: FileText,
          },
          {
            name: "Lecture Notes",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/r/personal/durvadaga_24_kgpian_iitkgp_ac_in/Documents/Lecture%20PPTs_Sem1/Lecture%20PPTs/Advanced%20Calculus?csf=1&web=1&e=XOlXgn",
            icon: FileText,
          },
          {
            name: "Tutorials-solution",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EvbzH0FixhpBr03NaVuVQ-AB7VCUx_FurLcTppmwP2fBEA?e=bwTCWE",
            icon: FileText,
          },
          { name: "Books", url: "https://iitkgpacin-my.sharepoint.com/:b:/r/personal/durvadaga_24_kgpian_iitkgp_ac_in/Documents/Books_Sem1/Books/Advanced%20Calculus/Advanced%20Engineering%20Mathematics%20by%20ERWIN%20KREYSZIG%2010th%20Edition.pdf?csf=1&web=1&e=tEHlzh", icon: BookOpen },
        ],
      },
      {
        id: "bem",
        name: "Basic Engineering Mechanics",
        image:
          "/photos/bem.png",
        resources: [
          {
            name: "Books",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/r/personal/durvadaga_24_kgpian_iitkgp_ac_in/Documents/Books_Sem1/Books/Basic%20Engineering%20Mechanics?csf=1&web=1&e=oyBX8M",
            icon: BookOpen,
          },
          {
            name: "Tutorials",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/durvadaga_24_kgpian_iitkgp_ac_in/EmkAAgVOHQxInUG-dL1sq10BYjadlVLKXPZWLx_0qRMr3w?e=zFis91",
            icon: FileText,
          }
        ],
      },
      {
        id: "pow",
        name: "Physics of Waves",
        image:
          "/photos/PoW.png",
        resources: [
          {
            name: "Books",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/r/personal/durvadaga_24_kgpian_iitkgp_ac_in/Documents/Books_Sem1/Books/Physics%20of%20Waves?csf=1&web=1&e=eZrxfZ",
            icon: BookOpen,
          },
          {
            name: "Tutorials",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/durvadaga_24_kgpian_iitkgp_ac_in/EjxQqOhyhjJIgreYilX8MbQBEAuyvIIDJKDZs2nFBKU6kw?e=JOJ7Ua",
            icon: FileText,
          },
          {
            name: "Slides",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/r/personal/durvadaga_24_kgpian_iitkgp_ac_in/Documents/Lecture%20PPTs_Sem1/Lecture%20PPTs/PoW?csf=1&web=1&e=bCXGF9",
            icon: BookOpen,
          },
          {
            name: "Short Notes",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EuuxkMtVi_RNitLAdo20fm4BVFuGr1Adzp7HuUt7tzu_8g?e=BvmJqQ",
            icon: FileText,
          },
        ],
      },
      {
        id: "pds",
        name: "Programming and Data Structures",
        image:
          "/photos/pds.png",
        resources: [
          {
            name: "Books",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/r/personal/durvadaga_24_kgpian_iitkgp_ac_in/Documents/Books_Sem1/Books/PDS?csf=1&web=1&e=ozQEQn",
            icon: BookOpen,
          },
          {
            name: "ppt",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/r/personal/durvadaga_24_kgpian_iitkgp_ac_in/Documents/Lecture%20PPTs_Sem1/Lecture%20PPTs/PDS?csf=1&web=1&e=NM4Q9w",
            icon: FileText,
          }
        ],
      },
      {
        id: "pds-lab",
        name: "PDS Lab",
        image:
          "/photos/pds.png",
        resources: [
          {
            name: "Assignments",
            url: "https://drive.google.com/drive/folders/1MDwIGHglz38wPjejkmqZQjCnUP46xtzB?usp=sharing",
            icon: FileText,
          },
        ],
      },
      {
        id: "ed",
        name: "Engineering Drawing",
        image:
          "/photos/ed.png",
        resources: [
          {
            name: "Books",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/r/personal/durvadaga_24_kgpian_iitkgp_ac_in/Documents/Books_Sem1/Books/Engineering%20Drawing?csf=1&web=1&e=SYx37z",
            icon: BookOpen,
          },
          {
            name: "Tutorials",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/durvadaga_24_kgpian_iitkgp_ac_in/Ehge4ES4fwBOkYplrkHnAjkB4rIGvN0zlReU7aw45i_K3A?e=k9andp",
            icon: FileText,
          },
          {
            name: "slides",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/r/personal/durvadaga_24_kgpian_iitkgp_ac_in/Documents/Lecture%20PPTs_Sem1/Lecture%20PPTs/ED?csf=1&web=1&e=wKHFGh",
            icon: FileText,
          }
        ],
      },
      {
        id: "pyq",
        name: "Previous Year Papers",
        image:
          "/photos/pyqs.png",
        resources: [
          {
            name: "Book",
            url: "https://iitkgpacin-my.sharepoint.com/:b:/r/personal/durvadaga_24_kgpian_iitkgp_ac_in/Documents/Books_Sem1/Books/PYQ_book.pdf?csf=1&web=1&e=cUZ2TG",
            icon: BookOpen,
          },
          {
            name: "Website",
            url: "https://qp.metakgp.org/",
            icon: FileText,
          }
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
          "/photos/EC.png",
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
          "/photos/ET.png",
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
          "/photos/IntroDS.png",
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
          "/photos/spl.png",
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
          "/photos/LinearAlgebra.png",
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
          "/photos/EC.png",
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
          "/photos/ET.png",
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
          "/photos/IntroDS.png",
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
          "/photos/spl.png",
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
          "/photos/spl.png",
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
