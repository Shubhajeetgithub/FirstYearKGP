import { BookOpen, FileText, Download } from "lucide-react";

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
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/durvadaga_24_kgpian_iitkgp_ac_in/IgBjYGiu5XAFTKGCeOyINVo0AYkOTRLqtBef6ZG_ElhgJcc?e=qaMG5D",
            icon: FileText,
          },
          {
            name: "Lecture Notes",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/durvadaga_24_kgpian_iitkgp_ac_in/IgCliGHbwpL9TYX6zYEsKyB4Afv0J6YFly0mJSMOCP7Z0E8?e=SpNwXn",
            icon: FileText,
          },
          {
            name: "Tutorials-solution",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EvbzH0FixhpBr03NaVuVQ-AB7VCUx_FurLcTppmwP2fBEA?e=bwTCWE",
            icon: FileText,
          },
          { name: "Books", url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/durvadaga_24_kgpian_iitkgp_ac_in/IgACle9f4kHfRbjtNQJZto8lAeT73MefsRbpg2XpMjG_Nps?e=ad56yf", icon: BookOpen },
        ],
      },
      {
        id: "bem",
        name: "Basic Engineering Mechanics",
        image:
          "https://github.com/Shubhajeetgithub/photos/blob/main/bem.png?raw=true",
        resources: [
          {
            name: "Books",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/durvadaga_24_kgpian_iitkgp_ac_in/IgB7RJ4bNrjwTaVAox8WuqIuAZIsCJ3yPWCmgcw-qXLuCxw?e=MLShLk",
            icon: BookOpen,
          },
          {
            name: "Tutorials",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/durvadaga_24_kgpian_iitkgp_ac_in/IgBpAAIFTh0MSJ1BvnS9bKtdAWI2nZVSylz2Vi8f9KkTK98?e=zlOMsT",
            icon: FileText,
          }
        ],
      },
      {
        id: "pow",
        name: "Physics of Waves",
        image:
          "https://github.com/Shubhajeetgithub/photos/blob/main/PoW.png?raw=true",
        resources: [
          {
            name: "Books",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/durvadaga_24_kgpian_iitkgp_ac_in/IgBBrA6EUHo0Sa83CNg0R_T_AeO4Kr1X-PcrPw2bj59Q4oo?e=axaSDr",
            icon: BookOpen,
          },
          {
            name: "Tutorials",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/durvadaga_24_kgpian_iitkgp_ac_in/IgA8UKjocoYySIK3mIpV_DG0ARALsryCAySg2bNpxQSlOpM?e=BAFw1H",
            icon: FileText,
          },
          {
            name: "Slides",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/durvadaga_24_kgpian_iitkgp_ac_in/IgCvcm-5gVAWSKKnia2rUGVcAfj5J-cySuPbLC0vLz_Dw5Y?e=AIflS8",
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
          "https://github.com/Shubhajeetgithub/photos/blob/main/pds.png?raw=true",
        resources: [
          {
            name: "Books",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/durvadaga_24_kgpian_iitkgp_ac_in/IgA-NCwQKEGrQ7TzhsWq-MH0AUd75U16s9jMUUW2T06MOzk?e=nNE0n2",
            icon: BookOpen,
          },
          {
            name: "ppt",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/durvadaga_24_kgpian_iitkgp_ac_in/IgAVVgQKAnw-RZ3w3uOTvyNeAay5opcI81-h4SJnYWqtl9A?e=D7OCoe",
            icon: FileText,
          }
        ],
      },
      {
        id: "pds-lab",
        name: "PDS Lab",
        image:
          "https://github.com/Shubhajeetgithub/photos/blob/main/pds.png?raw=true",
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
          "https://github.com/Shubhajeetgithub/photos/blob/main/ed.png?raw=true",
        resources: [
          {
            name: "Books",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/durvadaga_24_kgpian_iitkgp_ac_in/IgBby3d2WjSAT5sU-3PvsbqSAYJG-pQB_ShKAASPmuwOnvY?e=nIUlXb",
            icon: BookOpen,
          },
          {
            name: "Tutorials",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/durvadaga_24_kgpian_iitkgp_ac_in/IgAYHuBEuH8ATpGKZa5B5wI5AeKyBrzdM5UXlO2sOOYvytw?e=eRXD32",
            icon: FileText,
          },
          {
            name: "slides",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/durvadaga_24_kgpian_iitkgp_ac_in/IgCeN1pIH-LcTZuPVStWSBthAZGzBkCuNMdnKCj7A4MHI2A?e=JW1S9g",
            icon: FileText,
          }
        ],
      },
      {
        id: "pyq",
        name: "Previous Year Papers",
        image:
          "https://github.com/Shubhajeetgithub/photos/blob/main/pyqs.png?raw=true",
        resources: [
          {
            name: "Book",
            url: "https://iitkgpacin-my.sharepoint.com/:b:/g/personal/durvadaga_24_kgpian_iitkgp_ac_in/IQBvy7fpW8FITrLkDhBlLSw5AUsYqNwvsYlgu1u20_F3pIA?e=rwFfY8",
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
          "https://github.com/Shubhajeetgithub/photos/blob/main/ai.png?raw=true",
        resources: [
          {
            name: "Syllabus",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EuMYl6H2IOJJky9Dw2EMCnIBfXI52EhmYVYAS8qp7GGwIQ?e=1tFMOU",
            icon: FileText,
          },
          {
            name: "Books",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/Eh_R6pqy02NPsT91s554RxsBCyTBvJQNfnha5LE1UGaV4w?e=3O7zE6",
            icon: BookOpen,
          },
          {
            name: "Papers",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EvC0CmKxVOtChpN8RtXn8y0B8R4r42Zq_R9iSYt68GrMRA?e=yLHofH",
            icon: Download,
          },
          {
            name: "Fundae :)",
            url: "#",
            icon: FileText,
          },
        ],
      },
      {
        id: "ml",
        name: "Introduction to Machine Learning",
        image:
          "https://github.com/Shubhajeetgithub/photos/blob/main/ml.png?raw=true",
        resources: [
          {
            name: "Syllabus",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EjDmyXRJp_hHnIIb2WImNecByGAhXPExHk3Y8rOd62Vbig?e=ubPHtT",
            icon: FileText,
          },
          {
            name: "Books",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EhlPuj9UHXhHpvx6vot3OnEBJKcUxzVSzprIhKcNrJx7oQ?e=PpoHCb",
            icon: BookOpen,
          },
          {
            name: "Papers",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EjAKob4XOjZEu-jp3fgrN5wB8g9VzTEMP30CsBaRHLm4aA?e=dwnPMW",
            icon: Download,
          },
          {
            name: "Notes",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/Ei7kJJIBtl5FowNEcNGXTDMBpcUp2TOUnKw6K3j21Qykfw?e=SQRiDd",
            icon: Download,
          },
          {
            name: "Fundae :)",
            url: "#",
            icon: FileText,
          },
        ],
      },
      {
        id: "linalgAi",
        name: "Linear Algebra for AI",
        image:
          "https://github.com/Shubhajeetgithub/photos/blob/main/linalgai.png?raw=true",
        resources: [
          {
            name: "Syllabus",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EiJBmDFxyaxCkA5bK-xVmP4B5DoFiAgH7HHane22SGgFPw?e=cbKo7E",
            icon: FileText,
          },
          {
            name: "Books",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/ErO-fKkIXaZGjxydrtzEcs8BFsgm1ki1SoaVXgypca_TJw?e=VLZdwr",
            icon: BookOpen,
          },
          {
            name: "Papers",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/ErO-fKkIXaZGjxydrtzEcs8BFsgm1ki1SoaVXgypca_TJw?e=VLZdwr",
            icon: Download,
          },
          {
            name: "Fundae :)",
            url: "#",
            icon: FileText,
          },
        ],
      },
      {
        id: "algo",
        name: "Design and analysis of Algorithms",
        image:
          "https://github.com/Shubhajeetgithub/photos/blob/main/algo.png?raw=true",
        resources: [
          {
            name: "Syllabus",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EicvL3Qobq5MlBhrJDUxpqkBjgAe2vkQn2TUcMbtb_Z-UQ?e=aZWCNX",
            icon: FileText,
          },
          {
            name: "Books",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EjrKdtf2JqNPvVZ63MgurkYBFygA9KGRe4-ORrxCfZuglg?e=Gqzv3Q",
            icon: BookOpen,
          },
          {
            name: "Papers",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EhsaLfDcwdtFqPLnIaAs2nIBaF7QUz3t1fxoZL2_9uxuyg?e=M08bml",
            icon: Download,
          },
          {
            name: "Fundae :)",
            url: "#",
            icon: FileText,
          },
        ],
      },
      {
        id: "prob",
        name: "Probability and Statistics",
        image:
          "https://github.com/Shubhajeetgithub/photos/blob/main/pns.png?raw=true",
        resources: [
          {
            name: "Tutorials",
            url: "https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/ErBwm1HtSCRGs-o70EVy_LoBGNGVT1O_gamS1TQqEuLIzg?e=Ox3DhT",
            icon: FileText,
          },
        ],
      },
    ],
  },
};

export { semesterData };
