ALTER PROCEDURE [dbo].[__ClientsInvoiceReport_to_JSON]
-- Parameters goes here

AS

DECLARE
	@OrderBy varchar(50) = 'JobNo',
	@SortingBy varchar(50) = 'DESCENDING'

BEGIN
	SET NOCOUNT ON;

;WITH TotalData_CTE
AS
(
	SELECT JobNo, job.ReferenceNo AS QuotationNo, 0 AS InvoiceNo, 
			(SELECT TOP 1 JobSImportDetail.Hbl FROM JobSImportDetail WHERE JobNo = JobId) AS Mbl, 
			pol.Name AS POL, pod.Name AS POD, job.Quantities AS Volume, '' AS Supplier, 
			m.CustomerName as Customer, c.CustomerName as Consignee, '' as MemberOf, Etd, Eta, Atd, Ata, job.Status, u.UserName, 
			sales.UserName as Salesman, job.DepartmentId, d.DepartmentName, 
			CASE 
				WHEN (Ata IS NULL OR Tejrim = 0 
					OR (ContainerToCnee = 0 OR EmptyContainer = 0 OR PaidDO = 0 OR MissingDocuments = 0)) 
					AND CanceledJob = 0 AND Closed = 0 THEN 'New' ELSE 
			CASE 
				WHEN CanceledJob = 1  THEN 'Cancelled' ELSE 'Delivered' END END AS StatusType,

			CASE 
				WHEN Atd IS NULL AND Ata IS NULL AND Tejrim = 0 AND CanceledJob = 0 AND Closed = 0 THEN 'To Be Loaded' ELSE 
			CASE 
				WHEN Atd IS NOT NULL AND Ata IS NULL AND Tejrim = 0 AND CanceledJob = 0 AND Closed = 0 THEN 'On Water' ELSE 
			CASE 
				WHEN Atd IS NOT NULL AND Ata IS NOT NULL AND 
					(Tejrim = 0 OR (ContainerToCnee = 0 OR EmptyContainer = 0 OR PaidDO = 0 OR MissingDocuments = 0)) 
					AND CanceledJob = 0 AND Closed = 0 THEN 'Under Clearance' ELSE
			CASE 
				WHEN Tejrim = 1 AND CanceledJob = 0 THEN 'Delivered' ELSE
			CASE
				WHEN CanceledJob = 1 THEN 'Cancelled' ELSE
				'ERROR!' END END END END END AS JobStatusType
				, NULL AS InvoiceDate, NULL AS DueDate, NULL AS AgentDueDate
				, 0 as TotalInvoiceAmount 
				, 0 AS TotalInvoices, 0 AS TotalCostAmount
				, job.IsProtected as JobProtected
				, Tejrim
	FROM JobSImport job
		INNER JOIN Departments d ON d.Id = job.DepartmentId
		LEFT JOIN Customers m ON m.Id = job.CustomerId
		LEFT JOIN Customers c ON c.Id = job.ConsigneeId
		LEFT JOIN Ports pol ON pol.Id = job.SeaportDeparture
		LEFT JOIN Ports pod ON pod.Id = job.SeaportDestination
		LEFT JOIN Users u on u.Id = job.OperatingUserId
		LEFT JOIN Users sales on sales.Id = job.SalesId

	WHERE job.Closed = 0 AND CanceledJob = 0
		AND FullPaid = 0

	UNION
	
	SELECT JobNo, job.ReferenceNo AS QuotationNo, 0 AS InvoiceNo, 
			(SELECT TOP 1 Hbl FROM JobSExportDetail WHERE JobNo = JobId) AS Mbl, 
			pol.Name AS POL, pod.Name AS POD, job.Quantities AS Volume, '' AS Supplier, 
			m.CustomerName as Customer, c.CustomerName as Consignee, '' as MemberOf, Etd, Eta, Atd, Ata, job.Status, u.UserName, 
			sales.UserName as Salesman, job.DepartmentId, d.DepartmentName, 
			CASE 
				WHEN (Ata IS NULL OR Tejrim = 0 
					OR (ContainerToCnee = 0 OR EmptyContainer = 0 OR PaidDO = 0 OR MissingDocuments = 0)) 
					AND CanceledJob = 0 AND Closed = 0 THEN 'New' ELSE 
			CASE 
				WHEN CanceledJob = 1  THEN 'Cancelled' ELSE 'Delivered' END END AS StatusType,

			CASE 
				WHEN Atd IS NULL AND Ata IS NULL AND Tejrim = 0 AND CanceledJob = 0 AND Closed = 0 THEN 'To Be Loaded' ELSE 
			CASE 
				WHEN Atd IS NOT NULL AND Ata IS NULL AND Tejrim = 0 AND CanceledJob = 0 AND Closed = 0 THEN 'On Water' ELSE 
			CASE 
				WHEN Atd IS NOT NULL AND Ata IS NOT NULL AND 
					(Tejrim = 0 OR (ContainerToCnee = 0 OR EmptyContainer = 0 OR PaidDO = 0 OR MissingDocuments = 0)) 
					AND CanceledJob = 0 AND Closed = 0 THEN 'Under Clearance' ELSE
			CASE 
				WHEN Tejrim = 1 AND CanceledJob = 0 THEN 'Delivered' ELSE
			CASE
				WHEN CanceledJob = 1 THEN 'Cancelled' ELSE
				'ERROR!' END END END END END AS JobStatusType

				, NULL AS InvoiceDate, NULL AS DueDate, NULL AS AgentDueDate
				, 0 as TotalInvoiceAmount 
				, 0 AS TotalInvoices, 0 AS TotalCostAmount
				, job.IsProtected as JobProtected
				, Tejrim
	FROM JobSeaExport job
		INNER JOIN Departments d ON d.Id = job.DepartmentId
		LEFT JOIN Customers m ON m.Id = job.CustomerId
		LEFT JOIN Customers c ON c.Id = job.ConsigneeId
		LEFT JOIN Ports pol ON pol.Id = job.SeaportDeparture
		LEFT JOIN Ports pod ON pod.Id = job.SeaportDestination
		LEFT JOIN Users u on u.Id = job.OperatingUserId
		LEFT JOIN Users sales on sales.Id = job.SalesId

	WHERE job.Closed = 0 AND CanceledJob = 0
		AND FullPaid = 0
	
	UNION
	
	SELECT JobNo, job.ReferenceNo AS QuotationNo, 0 AS InvoiceNo, 
			(SELECT TOP 1 Hbl FROM JobSCDetail WHERE JobNo = JobId) AS Mbl, 
			pol.Name AS POL, pod.Name AS POD, job.Quantities AS Volume, '' AS Supplier, 
			m.CustomerName as Customer, c.CustomerName as Consignee, '' as MemberOf, Etd, Eta, Atd, Ata, job.Status, u.UserName, 
			sales.UserName as Salesman, job.DepartmentId, d.DepartmentName, 
			CASE 
				WHEN (Ata IS NULL OR Tejrim = 0) AND CanceledJob = 0 AND Closed = 0 THEN 'New' ELSE 
			CASE 
				WHEN CanceledJob = 1  THEN 'Cancelled' ELSE 'Delivered' END END AS StatusType,

			CASE 
				WHEN Atd IS NULL AND Ata IS NULL AND Tejrim = 0 AND CanceledJob = 0 AND Closed = 0 THEN 'Under Clearance' ELSE 
			CASE 
				WHEN Atd IS NOT NULL AND (Ata IS NULL) AND Tejrim = 0 AND CanceledJob = 0 AND Closed = 0 THEN 'Under Clearance' ELSE 
			CASE 
				WHEN Atd IS NOT NULL AND Ata IS NOT NULL AND 
					(Tejrim = 0) 
					AND CanceledJob = 0 AND Closed = 0 THEN 'Under Clearance' ELSE
			CASE 
				WHEN Tejrim = 1 AND CanceledJob = 0 THEN 'Delivered' ELSE
			CASE
				WHEN CanceledJob = 1 THEN 'Cancelled' ELSE
				'ERROR!' END END END END END AS JobStatusType
				, NULL AS InvoiceDate, NULL AS DueDate, NULL AS AgentDueDate
				, 0 as TotalInvoiceAmount 
				, 0 AS TotalInvoices, 0 AS TotalCostAmount
				, job.IsProtected as JobProtected
				, Tejrim
	FROM JobSeaClearance job
		INNER JOIN Departments d ON d.Id = job.DepartmentId
		LEFT JOIN Customers m ON m.Id = job.CustomerId
		LEFT JOIN Customers c ON c.Id = job.ConsigneeId
		LEFT JOIN Ports pol ON pol.Id = job.SeaportDeparture
		LEFT JOIN Ports pod ON pod.Id = job.SeaportDestination
		LEFT JOIN Users u on u.Id = job.OperatingUserId
		LEFT JOIN Users sales on sales.Id = job.SalesId

	WHERE job.Closed = 0 AND CanceledJob = 0
		AND FullPaid = 0

	UNION
	
	SELECT JobNo, job.ReferenceNo AS QuotationNo, 0 AS InvoiceNo, 
			(SELECT TOP 1 AWB FROM JobAIDetail WHERE job.JobNo = JobAIDetail.JobId) AS Mbl, 
			pol.Name AS POL, pod.Name AS POD, CAST(job.Charge AS nvarchar(128)) AS Volume, '' AS Supplier, 
			m.CustomerName as Customer, c.CustomerName as Consignee, '' as MemberOf, Etd, Eta, Atd, Ata, job.Status, u.UserName, 
			sales.UserName as Salesman, job.DepartmentId, d.DepartmentName, 
			CASE 
				WHEN (Ata IS NULL OR Tejrim = 0) AND CanceledJob = 0 AND Closed = 0 THEN 'New' ELSE 
			CASE 
				WHEN CanceledJob = 1  THEN 'Cancelled' ELSE 'Delivered' END END AS StatusType,

			CASE 
				WHEN Atd IS NULL AND Ata IS NULL AND Tejrim = 0 AND CanceledJob = 0 AND Closed = 0 THEN 'To Be Loaded' ELSE 
			CASE 
				WHEN Atd IS NOT NULL AND (Ata IS NULL) AND Tejrim = 0 AND CanceledJob = 0 AND Closed = 0 THEN 'On Water' ELSE 
			CASE 
				WHEN Atd IS NOT NULL AND Ata IS NOT NULL AND 
					(Tejrim = 0) 
					AND CanceledJob = 0 AND Closed = 0 THEN 'Under Clearance' ELSE
			CASE 
				WHEN Tejrim = 1 AND CanceledJob = 0 THEN 'Delivered' ELSE
			CASE
				WHEN CanceledJob = 1 THEN 'Cancelled' ELSE
				'ERROR!' END END END END END AS JobStatusType

				, NULL AS InvoiceDate, NULL AS DueDate, NULL AS AgentDueDate
				, 0 as TotalInvoiceAmount 
				, 0 AS TotalInvoices, 0 AS TotalCostAmount
				, job.IsProtected as JobProtected
				, Tejrim
	FROM JobAirImport job
		INNER JOIN Departments d ON d.Id = job.DepartmentId
		LEFT JOIN Customers m ON m.Id = job.CustomerId
		LEFT JOIN Customers c ON c.Id = job.ConsigneeId
		LEFT JOIN Ports pol ON pol.Id = job.AirportDeparture
		LEFT JOIN Ports pod ON pod.Id = job.AirportDestination
		LEFT JOIN Users u on u.Id = job.OperatingUserId
		LEFT JOIN Users sales on sales.Id = job.SalesId

	WHERE job.Closed = 0 AND CanceledJob = 0
		AND FullPaid = 0

	UNION
	
	SELECT job.JobNo, job.ReferenceNo AS QuotationNo, 0 AS InvoiceNo, 
			(SELECT TOP 1 AWB FROM JobAEDetail WHERE job.JobNo = JobAEDetail.JobNo) AS Mbl, 
			pol.Name AS POL, pod.Name AS POD, CAST(job.Charge AS nvarchar(128)) AS Volume, '' AS Supplier, 
			m.CustomerName as Customer, c.CustomerName as Consignee, '' as MemberOf, Etd, Eta, Atd, Ata, job.Status, u.UserName, 
			sales.UserName as Salesman, job.DepartmentId, d.DepartmentName, 
			CASE 
				WHEN (Ata IS NULL OR Tejrim = 0) AND CanceledJob = 0 AND Closed = 0 THEN 'New' ELSE 
			CASE 
				WHEN CanceledJob = 1  THEN 'Cancelled' ELSE 'Delivered' END END AS StatusType,

			CASE 
				WHEN Atd IS NULL AND Ata IS NULL AND Tejrim = 0 AND CanceledJob = 0 AND Closed = 0 THEN 'To Be Loaded' ELSE 
			CASE 
				WHEN Atd IS NOT NULL AND (Ata IS NULL) AND Tejrim = 0 AND CanceledJob = 0 AND Closed = 0 THEN 'On Water' ELSE 
			CASE 
				WHEN Atd IS NOT NULL AND Ata IS NOT NULL AND 
					(Tejrim = 0) 
					AND CanceledJob = 0 AND Closed = 0 THEN 'Under Clearance' ELSE
			CASE 
				WHEN Tejrim = 1 AND CanceledJob = 0 THEN 'Delivered' ELSE
			CASE
				WHEN CanceledJob = 1 THEN 'Cancelled' ELSE
				'ERROR!' END END END END END AS JobStatusType
				, NULL AS InvoiceDate, NULL AS DueDate, NULL AS AgentDueDate
				, 0 as TotalInvoiceAmount 
				, 0 AS TotalInvoices, 0 AS TotalCostAmount
				, job.IsProtected as JobProtected
				, Tejrim
	FROM JobAirExport job
		INNER JOIN Departments d ON d.Id = job.DepartmentId
		LEFT JOIN Customers m ON m.Id = job.CustomerId
		LEFT JOIN Customers c ON c.Id = job.ConsigneeId
		LEFT JOIN Ports pol ON pol.Id = job.AirportDeparture
		LEFT JOIN Ports pod ON pod.Id = job.AirportDestination
		LEFT JOIN Users u on u.Id = job.OperatingUserId
		LEFT JOIN Users sales on sales.Id = job.SalesId

	WHERE job.Closed = 0 AND CanceledJob = 0
		AND FullPaid = 0

	UNION
	
	SELECT JobNo, job.ReferenceNo AS QuotationNo, 0 AS InvoiceNo, 
			(SELECT TOP 1 AWB FROM JobACDetail WHERE job.JobNo = JobACDetail.JobID) AS Mbl, 
			pol.Name AS POL, pod.Name AS POD, CAST(job.Charge AS nvarchar(128)) AS Volume, '' AS Supplier, 
			m.CustomerName as Customer, c.CustomerName as Consignee, '' as MemberOf, Etd, Eta, Atd, Ata, job.Status, u.UserName, 
			sales.UserName as Salesman, job.DepartmentId, d.DepartmentName, 
			CASE 
				WHEN (Ata IS NULL OR Tejrim = 0) AND CanceledJob = 0 AND Closed = 0 THEN 'New' ELSE 
			CASE 
				WHEN CanceledJob = 1  THEN 'Cancelled' ELSE 'Delivered' END END AS StatusType,

			CASE 
				WHEN Atd IS NULL AND Ata IS NULL AND Tejrim = 0 AND CanceledJob = 0 AND Closed = 0 THEN 'To Be Loaded' ELSE 
			CASE 
				WHEN Atd IS NOT NULL AND (Ata IS NULL) AND Tejrim = 0 AND CanceledJob = 0 AND Closed = 0 THEN 'On Water' ELSE 
			CASE 
				WHEN Atd IS NOT NULL AND Ata IS NOT NULL AND 
					(Tejrim = 0) 
					AND CanceledJob = 0 AND Closed = 0 THEN 'Under Clearance' ELSE
			CASE 
				WHEN Tejrim = 1 AND CanceledJob = 0 THEN 'Delivered' ELSE
			CASE
				WHEN CanceledJob = 1 THEN 'Cancelled' ELSE
				'ERROR!' END END END END END AS JobStatusType
				, NULL AS InvoiceDate, NULL AS DueDate, NULL AS AgentDueDate
				, 0 as TotalInvoiceAmount 
				, 0 AS TotalInvoices, 0 AS TotalCostAmount
				, job.IsProtected as JobProtected
				, Tejrim
	FROM JobAirClearance job
		INNER JOIN Departments d ON d.Id = job.DepartmentId
		LEFT JOIN Customers m ON m.Id = job.CustomerId
		LEFT JOIN Customers c ON c.Id = job.ConsigneeId
		LEFT JOIN Ports pol ON pol.Id = job.AirportDeparture
		LEFT JOIN Ports pod ON pod.Id = job.AirportDestination
		LEFT JOIN Users u on u.Id = job.OperatingUserId
		LEFT JOIN Users sales on sales.Id = job.SalesId

	WHERE job.Closed = 0 AND CanceledJob = 0
		AND FullPaid = 0

	UNION

	SELECT JobNo, job.ReferenceNo AS QuotationNo, 0 AS InvoiceNo, 
			(SELECT TOP 1 Hbl FROM JobLFDetails WHERE job.JobNo = JobLFDetails.JobId) AS Mbl, 
			pol.Name AS POL, pod.Name AS POD, job.Quantities AS Volume, '' AS Supplier, 
			m.CustomerName as Customer, c.CustomerName as Consignee, '' as MemberOf, Etd, Eta, Atd, Ata, job.Status, u.UserName, 
			sales.UserName as Salesman, job.DepartmentId, d.DepartmentName, 
			CASE 
				WHEN (Ata IS NULL OR Tejrim = 0) AND CanceledJob = 0 AND Closed = 0 THEN 'New' ELSE 
			CASE 
				WHEN CanceledJob = 1  THEN 'Cancelled' ELSE 'Delivered' END END AS StatusType,

			CASE 
				WHEN Atd IS NULL AND Ata IS NULL AND Tejrim = 0 AND CanceledJob = 0 AND Closed = 0 THEN 'To Be Loaded' ELSE 
			CASE 
				WHEN Atd IS NOT NULL AND (Ata IS NULL) AND Tejrim = 0 AND CanceledJob = 0 AND Closed = 0 THEN 'On Water' ELSE 
			CASE 
				WHEN Atd IS NOT NULL AND Ata IS NOT NULL AND 
					(Tejrim = 0) 
					AND CanceledJob = 0 AND Closed = 0 THEN 'Under Clearance' ELSE
			CASE 
				WHEN Tejrim = 1 AND CanceledJob = 0 THEN 'Delivered' ELSE
			CASE
				WHEN CanceledJob = 1 THEN 'Cancelled' ELSE
				'ERROR!' END END END END END AS JobStatusType
				, NULL AS InvoiceDate, NULL AS DueDate, NULL AS AgentDueDate
				, 0 as TotalInvoiceAmount 
				, 0 AS TotalInvoices, 0 AS TotalCostAmount
				, job.IsProtected as JobProtected
				, Tejrim
	FROM JobLandFreight job
		INNER JOIN Departments d ON d.Id = job.DepartmentId
		LEFT JOIN Customers m ON m.Id = job.CustomerId
		LEFT JOIN Customers c ON c.Id = job.ConsigneeId
		LEFT JOIN Ports pol ON pol.Id = job.Departure
		LEFT JOIN Ports pod ON pod.Id = job.Destination
		LEFT JOIN Users u on u.Id = job.OperatingUserId
		LEFT JOIN Users sales on sales.Id = job.SalesId

	WHERE job.Closed = 0 AND CanceledJob = 0
		AND FullPaid = 0
),
TotalInvoices_CTE
AS
(
	SELECT JobNo, QuotationNo, CAST(m.InvoiceNo AS nvarchar(50)) AS InvoiceNo, Mbl, POL, POD,  Volume, '' AS Supplier, 
		Customer, Consignee, MemberOf, Etd, Eta, Atd, Ata, Status, UserName, Salesman, job.DepartmentId, DepartmentName,
		StatusType, JobStatusType, 
		m.InvoiceDate,
		m.DueDate, 
		SUM(m.S_Amount) - SUM(m.TotalReceived) AS TotalInvoiceAmount, Paid
		, JobProtected,
		m.IsProtected as invoiceProtected
		, Tejrim
		
	FROM TotalData_CTE job
		INNER JOIN MainInvoice m on m.JobId = job.JobNo AND m.DepartmentId = job.DepartmentId

GROUP BY JobNo, QuotationNo, m.InvoiceNo, Mbl, POL, POD,  Volume, Supplier, 
	Customer, Consignee, MemberOf, Etd, Eta, Atd, Ata, Status, UserName, Salesman, job.DepartmentId, DepartmentName,
	StatusType, JobStatusType, 
	m.InvoiceDate, m.DueDate, Paid, CustomDueDate, JobProtected, m.IsProtected, Tejrim
),
FINAL_CTE
AS
	(
	SELECT JobNo, QuotationNo, Mbl, POL, POD,  Volume, Supplier, 
			Customer, Consignee, MemberOf, Etd, Eta, Atd, Ata, Status, UserName, Salesman, job.DepartmentId, DepartmentName,
			StatusType, JobStatusType,
			TotalInvoiceAmount, 
			0 AS TotalCostAmount
			, InvoiceNo
			, InvoiceDate
			, DueDate
			, NULL AS AgentDueDate
			, JobProtected
			, invoiceProtected
			, Tejrim
			
	FROM TotalInvoices_CTE job
)

SELECT JobNo, QuotationNo, job.InvoiceNo, Mbl, POL, POD,  Volume, 
  	    REPLACE(REPLACE(Supplier, '&', '&amp;'), '<', '&lt;') AS Supplier,
		REPLACE(REPLACE(Customer, '&', '&amp;'), '<', '&lt;') AS Customer,
		REPLACE(REPLACE(Consignee, '&', '&amp;'), '<', '&lt;') AS Consignee,
		REPLACE(REPLACE(ISNULL(MemberOf, '') , '&', '&amp;'), '<', '&lt;') AS MemberOf,
		Etd, Eta, Atd, Ata, 
		REPLACE(REPLACE(ISNULL(Status, '') , '&', '&amp;'), '<', '&lt;') AS Status,
		UserName, Salesman, job.DepartmentId, DepartmentName,
		StatusType, JobStatusType, job.InvoiceDate, DueDate, AgentDueDate,
		TotalInvoiceAmount, 
		TotalCostAmount
		, JobProtected as IsProtected
		, invoiceProtected
		, Tejrim
		, CASE WHEN Atd IS NULL AND Tejrim = 0 THEN 'To Be Loaded' 
			ELSE 
			CASE WHEN ((Atd IS NOT NULL and Atd <= GETDATE() and Etd IS NOT NULL)) THEN 'On Water' ELSE 'N/A' END END AS StatusType1
		, dbo._TotalInvoices_V2(JobNo, DepartmentId) as TotalInvoices
		, dbo._TotalCosts_V1(JobNo, DepartmentId) as TotalCosts
		, dbo._TotalInvoices_V2(JobNo, DepartmentId) - dbo._TotalCosts_V1(JobNo, DepartmentId) as TotalProfit

FROM FINAL_CTE job

ORDER BY
CASE WHEN @SortingBy = 'ASCENDING' THEN 
	CASE     
		WHEN @OrderBy = 'ByJobNo' THEN (RANK() OVER (ORDER BY JobNo))
		WHEN @OrderBy = 'ByDueDate' THEN (RANK() OVER (ORDER BY DueDate))
		WHEN @OrderBy = 'ByQuotationNo' THEN (RANK() OVER (ORDER BY QuotationNo))
		WHEN @OrderBy = 'ByETA' THEN (RANK() OVER (ORDER BY Eta))
		WHEN @OrderBy = 'ByATA' THEN (RANK() OVER (ORDER BY Ata))
		WHEN @OrderBy = 'ByETD' THEN (RANK() OVER (ORDER BY Etd))
		WHEN @OrderBy = 'ByATD' THEN (RANK() OVER (ORDER BY Atd))
		ELSE (RANK() OVER (ORDER BY JobNo))
	END 
END ASC,
CASE WHEN @SortingBy = 'DESCENDING' THEN 
	CASE     
		WHEN @OrderBy = 'ByJobNo' THEN (RANK() OVER (ORDER BY JobNo))
		WHEN @OrderBy = 'ByDueDate' THEN (RANK() OVER (ORDER BY DueDate))
		WHEN @OrderBy = 'ByQuotationNo' THEN (RANK() OVER (ORDER BY QuotationNo))
		WHEN @OrderBy = 'ByETA' THEN (RANK() OVER (ORDER BY Eta))
		WHEN @OrderBy = 'ByATA' THEN (RANK() OVER (ORDER BY Ata))
		WHEN @OrderBy = 'ByETD' THEN (RANK() OVER (ORDER BY Etd))
		WHEN @OrderBy = 'ByATD' THEN (RANK() OVER (ORDER BY Atd))
		ELSE (RANK() OVER (ORDER BY JobNo))
	END 
END DESC
	--
 FOR JSON PATH, INCLUDE_NULL_VALUES

END
