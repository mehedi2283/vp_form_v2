import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AppFormData } from "./schema";

export const fetchNextApplicationId = async (): Promise<string> => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  let serial = "000001"; // Default fallback

  try {
    const locationId = (import.meta as any).env?.VITE_GHL_LOCATION_ID;
    const apiKey = (import.meta as any).env?.VITE_GHL_API_KEY;
    const customValueId = (import.meta as any).env?.VITE_GHL_CUSTOM_VALUE_ID;

    if (!locationId || !apiKey || !customValueId) {
      throw new Error("Missing GHL API credentials in environment variables.");
    }

    // 1. Fetch the current custom value
    const response = await fetch(
      `https://services.leadconnectorhq.com/locations/${locationId}/customValues`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Version: "2021-07-28"
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      const valueObj = data.customValues.find((v: any) => v.id === customValueId);
      
      if (valueObj && valueObj.value !== undefined) {
        let currentValue = parseInt(valueObj.value, 10);
        if (isNaN(currentValue)) currentValue = 0;
        
        // Use the value as is
        serial = currentValue.toString().padStart(6, '0');
      }
    } else {
      throw new Error("GHL API responded with an error");
    }
  } catch (error) {
    console.warn("Failed to fetch from GHL API, falling back to local counter.", error);
    // Fallback to local storage if the API fails
    let currentCount = parseInt(localStorage.getItem('application_counter') || '0', 10);
    currentCount += 1;
    localStorage.setItem('application_counter', currentCount.toString());
    serial = currentCount.toString().padStart(6, '0');
  }
  
  // Format: VP-YYYYMMDD-SERIAL
  // Example: VP-20260226-000001
  return `VP-${year}${month}${day}-${serial}`;
};

const HEADER_IMAGE_URL = "https://assets.cdn.filesafe.space/bMHEhrsPG33S3OXisGS9/media/699eb561590acb89c85c766b.png";

const fetchImageAsBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.error("Error fetching header image", e);
    return "";
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const generatePDF = async (data: AppFormData, applicationId: string, mediaLinks: Record<string, string>): Promise<Blob> => {
  const doc = new jsPDF();
  
  doc.setProperties({
    title: `${applicationId}.pdf`,
    subject: `Application Form - ${applicationId}`,
    author: 'Veritas',
    creator: 'Veritas Application Portal'
  });

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Fetch header image
  const headerBase64 = await fetchImageAsBase64(HEADER_IMAGE_URL);

  const drawFooter = (doc: jsPDF, pageNumber: number, totalPages: number) => {
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    
    const margin = 14;
    const footerY = pageHeight - 25;

    // Line 1: Address & Tel
    doc.text("Address: G-4, ExpressWay, 1 Dock Road, London, E16 1AH, Tel: +44 20 3355 9930,", margin, footerY);
    
    // Line 2: Email & Website
    let currentX = margin;
    doc.text("Email: ", currentX, footerY + 4);
    currentX += doc.getTextWidth("Email: ");
    
    doc.setTextColor(0, 150, 255);
    doc.text("info@veritaspathways.co.uk", currentX, footerY + 4);
    doc.link(currentX, footerY + 1, doc.getTextWidth("info@veritaspathways.co.uk"), 4, { url: "mailto:info@veritaspathways.co.uk" });
    currentX += doc.getTextWidth("info@veritaspathways.co.uk");
    
    doc.setTextColor(100);
    doc.text(", Website: ", currentX, footerY + 4);
    currentX += doc.getTextWidth(", Website: ");
    
    doc.setTextColor(0, 150, 255);
    doc.text("www.veritaspathways.co.uk", currentX, footerY + 4);
    doc.link(currentX, footerY + 1, doc.getTextWidth("www.veritaspathways.co.uk"), 4, { url: "https://www.veritaspathways.co.uk" });
    
    // Line 3: Registration
    doc.setTextColor(100);
    doc.text("Registered in England and Wales No. 14099365.", margin, footerY + 8);
    
    // Line 4: Copyright & Page
    doc.text("Veritas Pathways Ltd. All rights reserved", margin, footerY + 12);
    doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - margin, footerY + 12, { align: "right" });
    
    // Bottom border line
    doc.setDrawColor(200);
    doc.line(margin, footerY + 15, pageWidth - margin, footerY + 15);
  };

  // Header with Background Image
  if (headerBase64) {
    // Reduced height from 40 to 25
    doc.addImage(headerBase64, "PNG", 14, 10, 182, 25); 
  }
  
  // Text in the bottom-left corner of the header image
  const headerBottomY = 32; // Adjusted based on new height
  const headerLeftX = 18;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(0, 100, 100); 
  doc.text("Application Form", headerLeftX, headerBottomY - 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(80);
  doc.text(`Application ID: ${applicationId}`, headerLeftX, headerBottomY - 4);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, headerLeftX, headerBottomY);

  let yPos = 45; // Start tables higher up

  const sections = [
    {
      title: "1. Personal Details",
      data: [
        ["First Name", data.firstName],
        ["Surname", data.surname],
        ["Preferred Name", data.preferredName || "-"],
        ["Email", data.email],
        ["Date of Birth", data.dateOfBirth],
        ["Gender", data.gender],
        ["Nationality", data.nationality],
        ["Passport Number", data.passportNumber || "-"],
        ["Country of Residence", data.countryOfResidence],
        ["Requires Visa", data.requiresVisa],
      ]
    },
    {
      title: "2. Contact Information",
      data: [
        ["Email Address", data.emailAddress],
        ["Phone Number", data.phoneNumber],
        ["Current Address", data.currentAddress],
      ]
    },
    {
      title: "3. Programme Selection",
      data: [
        ["Programme", data.programme],
        ["Preferred Intake", data.preferredIntake],
        ["Intended Degree", data.intendedDegreeProgression || "-"],
      ]
    },
    {
      title: "4. Academic Background",
      data: [
        ["Highest Qualification", data.highestQualification],
        ["Institution Name", data.institutionName],
        ["Country of Institution", data.countryOfInstitution],
        ["Year of Completion", data.yearOfCompletion],
        ["Qualifications & Grades", data.qualificationsAndGrades],
      ]
    },
    {
      title: "5. English Language Ability",
      data: [
        ["English First Language", data.isEnglishFirstLanguage],
        ["Test Taken", data.englishTestTaken || "-"],
        ["Test Score", data.englishTestScore || "-"],
        ["Test Date", data.englishTestDate || "-"],
      ]
    },
    {
      title: "6. Personal Statement",
      data: [
        ["Personal Statement", data.personalStatement],
      ]
    },
    {
      title: "7. Additional Information",
      data: [
        ["Has Disability", data.hasDisability],
        ["Disability Details", data.disabilityDetails || "-"],
        ["Requires Learning Support", data.requiresLearningSupport],
      ]
    },
    {
      title: "8. Marketing & Referral",
      data: [
        ["Heard About Us", data.hearAboutUs],
        ["Agent Name", data.agentName || "-"],
      ]
    }
  ];

  sections.forEach(section => {
    // Check if there's enough space for the header and at least one row
    // If not, force a page break before drawing the table
    if (yPos > pageHeight - 45) {
      doc.addPage();
      yPos = 20;
    }

    autoTable(doc, {
      startY: yPos,
      head: [[{ content: section.title, colSpan: 2, styles: { fillColor: [45, 212, 191], textColor: 255, fontStyle: 'bold' } }]],
      body: section.data,
      theme: 'grid',
      headStyles: { fillColor: [45, 212, 191] },
      styles: { fontSize: 9, cellPadding: 4, overflow: 'linebreak' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } },
      margin: { top: 20, bottom: 30 }, // Reduced top margin
      pageBreak: 'auto',
    });
    yPos = (doc as any).lastAutoTable.finalY + 10;
  });

  // Signature
  if (data.signature) {
    if (yPos + 50 > doc.internal.pageSize.height - 30) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.text("Your Signature:", 14, yPos);
    try {
        doc.addImage(data.signature, "PNG", 14, yPos + 5, 60, 30);
    } catch (e) {
        console.error("Error adding signature to PDF", e);
    }
  }

  // Append Uploaded Images using links
  const uploadFields = [
    { webhookKey: "passport_upload_link", label: "Passport Copy" },
    { webhookKey: "transcripts_upload_link", label: "Academic Transcripts" },
    { webhookKey: "english_cert_upload_link", label: "English Certificate" }
  ];

  for (const field of uploadFields) {
    const imageUrl = mediaLinks[field.webhookKey];
    if (imageUrl) {
      try {
        const base64 = await fetchImageAsBase64(imageUrl);
        if (base64) {
          doc.addPage();
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.text(field.label, 14, 20);
          
          // Calculate dimensions to fit page
          const imgProps = doc.getImageProperties(base64);
          const ratio = imgProps.width / imgProps.height;
          let imgWidth = pageWidth - 28;
          let imgHeight = imgWidth / ratio;
          
          if (imgHeight > pageHeight - 60) {
            imgHeight = pageHeight - 60;
            imgWidth = imgHeight * ratio;
          }
          
          doc.addImage(base64, imgProps.fileType, 14, 30, imgWidth, imgHeight);
        }
      } catch (e) {
        console.error(`Error adding ${field.label} to PDF from URL`, e);
      }
    }
  }

  // Add footers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(doc, i, totalPages);
  }

  return doc.output("blob");
};
